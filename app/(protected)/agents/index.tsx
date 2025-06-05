import { useLocalSearchParams } from "expo-router";
import React from "react";

import { PrimaryButton } from "@/components/Button/Primary";
import { DropdownMenu, MenuOption } from "@/components/DropDown";
import { Sheet, useSheetRef } from "@/components/sheet";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { get } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Camera, CaretDown, Plus } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function App() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { status, isReady } = useServerWarmup();
  const disableBackNav = true;
  const router = useRouter();

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const userString = await SecureStore.getItemAsync("user_info");
        if (userString) {
          setUserInfo(JSON.parse(userString));
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        toast.error("Could not load user information");
      } finally {
        setLoading(false);
      }
    }

    loadUserInfo();
  }, []);

  if (loading || status === "warming-up") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>
          {status === "warming-up" ? "Waking up server..." : "Loading..."}
        </Text>
      </View>
    );
  }

  if (!userInfo) {
    return <HostApp usersName="Guest User" />;
  }

  return (
    <HostApp usersName={`${userInfo["first_name"]} ${userInfo["last_name"]}`} />
  );
}

const HostApp = ({ usersName }: { usersName: string }) => {
  const { email } = useLocalSearchParams();
  const sheetRef = useSheetRef();
  const styles = styleSheet();
  const { background, text, text_2, heading } = styles;
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const { status, warmupServerManually } = useServerWarmup();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const scale = useSharedValue(1);

  const isDummy = listings.length === 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -50 }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 12,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  // Fetch listings from the API
  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await get("/listings", {
        requiresAuth: false,
        handleColdStart: true,
      });

      if (response.data) {
        // @ts-expect-error response error
        setListings(response.data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load listings when component mounts or server becomes ready
  useEffect(() => {
    if (status === "ready") {
      fetchListings();
    }
  }, [status]);

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: top,
        },
        background,
      ]}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
          },

          styles.border,
        ]}
      >
        <View style={{ gap: 4 }}>
          <Text style={heading}>Hello</Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={styles.online} />
            <Text style={[text]}>{usersName}</Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", paddingTop: 20 }}>
          <Text style={[text, text_2]}>Logged in as</Text>
          <Text style={[styles.user_type, styles.semiBold]}>Host</Text>
        </View>
      </View>

      <Animated.View
        style={[
          {
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            bottom: 20,
            left: width / 2,
            backgroundColor: theme.color.appSurface,
            borderRadius: 999,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1.41,
            elevation: 2,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={() => {
            sheetRef.current?.present();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 8,
            flex: 1,
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Plus size={16} weight="bold" color={theme.color.appTextPrimary} />
          <Text
            style={{
              color: theme.color.appTextPrimary,
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.xs,
              letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
            }}
          >
            Add listing
          </Text>
        </Pressable>
      </Animated.View>

      <Sheet
        ref={sheetRef}
        onDismiss={Keyboard.dismiss}
        overDragResistanceFactor={0}
      >
        <BottomSheetView
          style={{
            height,
            paddingTop: top - 28,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}
            onLongPress={Keyboard.dismiss}
          >
            <View style={{ paddingHorizontal: 16, paddingTop: 12, flex: 1 }}>
              <PrimaryButton
                style={{
                  backgroundColor: theme.color.appDropShadow,
                  alignSelf: "flex-start",
                  width: "auto",
                  paddingHorizontal: 24,
                }}
                textStyle={{ color: theme.color.appTextPrimary }}
                onPress={() => {
                  Keyboard.dismiss();
                  sheetRef.current?.close();
                }}
              >
                Exit
              </PrimaryButton>
              <Text
                style={[
                  {
                    marginTop: 40,
                    fontSize: 38,
                    color: theme.color.appTextPrimary,
                  },
                  theme.fontStyles.semiBold,
                ]}
              >
                Add Listing
              </Text>
              <AddListing />
            </View>
          </Pressable>
        </BottomSheetView>
      </Sheet>

      <ScrollView
        style={{
          flexShrink: 0,
          marginTop: 32,
          display: "flex",
          marginBottom: 100 - bottom,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ height: 68 }} />
      </ScrollView>
    </View>
  );
};

function AddListing() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [property, setProperty] = useState("House");
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ marginTop: 24, gap: 32, flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Address
        </Text>
        <TextField autoFocus autoCapitalize="none" autoCorrect={false} />
        <Text
          style={[
            { fontSize: 14, color: theme.color.appTextSecondary },
            theme.fontStyles.medium,
          ]}
        >
          This is just an approximate address that will be shown to guest users
          that hasn’t indicated interest.
        </Text>
      </KeyboardAvoidingView>

      <View style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Get location data
        </Text>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
          onPress={() => {
            const latitude = 9.0573;
            const longitude = 7.4951;
            const label = "Somewhere";

            const url = Platform.select({
              ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
              android: `geo:${latitude},${longitude}?q=${label}`,
            });
            Linking.openURL(url!);
          }}
        >
          Open Maps
        </PrimaryButton>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={[
              { fontSize: 16, color: theme.color.appTextPrimary },
              theme.fontStyles.semiBold,
            ]}
          >
            Upload photos
          </Text>
          <Camera size={20} color={theme.color.appTextAccent} weight="bold" />
        </View>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
        >
          Open Photos
        </PrimaryButton>
      </View>

      <View style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Type of property
        </Text>
        <DropdownMenu
          itemsBackgroundColor={theme.color.appSurface}
          visible={visible}
          handleOpen={() => {
            setVisible(true);
            Keyboard.dismiss();
          }}
          handleClose={() => setVisible(false)}
          trigger={
            <View
              style={[
                styles.triggerStyle,
                {
                  borderColor: theme.color.elementsTextFieldBorder,
                  backgroundColor: theme.color.elementsTextFieldBackground,
                  borderWidth: 3,
                  gap: 8,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  ...theme.fontStyles.regular,
                  color: theme.color.appTextSecondary,
                }}
              >
                {property}
              </Text>
              <CaretDown
                weight="light"
                color={theme.color.appTextSecondary}
                size={20}
              />
            </View>
          }
        >
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setProperty("House");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              House
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setProperty("Land");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              Land
            </Text>
          </MenuOption>
        </DropdownMenu>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: bottom + 24,
        }}
      >
        <PrimaryButton>Next</PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  triggerStyle: {
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // width: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
    alignSelf: "flex-start",
  },
});

const styleSheet = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();

  return {
    searchContainer: {
      backgroundColor: theme.color.appSurface,
      shadowColor: `${theme.color.appSecondary}4D`,
    },
    search: {
      fontSize: theme.fontSizes.xxs,
      ...theme.fontStyles.semiBold,
      letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xxs,
      color: theme.color.appSecondary,
    },
    online: {
      backgroundColor: theme.color.elementsOnlineIndicatorOnline,
      width: 12,
      height: 12,
      borderRadius: 999,
    },
    background: {
      backgroundColor: theme.color.appBackground,
    },
    user_type: {
      fontSize: theme.fontSizes.xl_3,
      color: theme.color.appTextAccent,
    },
    text: {
      ...theme.fontStyles.regular,
      color: theme.color.appTextPrimary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm,
      letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.sm,
    },
    text_2: {
      color: theme.color.appTextSecondary,
    },
    heading: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.display,
      color: theme.color.appTextPrimary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.display,
    },
    _email_: {
      color: theme.color.appTextAccent,
    },
    subHead: {
      color: theme.color.appTextPrimary,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.fontSizes.base + 8,
    },
    semiBold: {
      ...theme.fontStyles.semiBold,
    },
    border: {
      borderColor: theme.color.elementsTextFieldBorder,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  };
};
