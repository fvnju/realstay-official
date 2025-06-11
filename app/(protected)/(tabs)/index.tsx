import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import ListingCard from "@/components/ListingCard";
import TextField from "@/components/TextField";
import { Sheet, useSheetRef } from "@/components/sheet";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, get } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as SecureStore from "expo-secure-store";
import { ArrowLeft, MagnifyingGlass } from "phosphor-react-native";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
    return <GuestApp usersName="Guest User" />;
  }

  return (
    <GuestApp
      usersName={`${userInfo["first_name"]} ${userInfo["last_name"]}`}
    />
  );
}

const GuestApp = ({ usersName }: { usersName: string }) => {
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

  const [search, setSearch] = useState("");
  const searchRef = useRef<TextInput>(null);
  const [searchListings, setSearchListings] = useState([]);
  useDebouncedEffect(
    () => {
      if (search.length > 0) {
        apiRequest("/listing", { requiresAuth: true }).then((val) => {
          setSearchListings((val.data as any).listings as []);
          if (((val.data as any).listings as []).length === 0) {
            toast.error("Nothing showed up!");
          }
        });
      }
    },
    500,
    [search]
  );

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
          <Text style={[styles.user_type, styles.semiBold]}>Guest</Text>
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
          <MagnifyingGlass
            size={16}
            weight="bold"
            color={theme.color.appTextPrimary}
          />
          <Text
            style={{
              color: theme.color.appTextPrimary,
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.xs,
              letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
            }}
          >
            Search
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
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    height: 48,
                    width: 48 + 24,
                    alignItems: "center",
                    flexDirection: "row",
                    paddingLeft: 24,
                  }}
                  onPress={() => {
                    sheetRef.current?.dismiss();
                  }}
                >
                  <ArrowLeft
                    weight="bold"
                    size={28}
                    color={theme.color.appTextPrimary}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    ...theme.fontStyles.semiBold,
                    fontSize: theme.fontSizes.xl_4,
                    color: theme.color.appTextPrimary,
                    letterSpacing:
                      theme.letterSpacing.tight * theme.fontSizes.xl_4,
                  }}
                >
                  Where to?
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <FlatList
                  scrollEnabled
                  centerContent
                  data={searchListings}
                  renderItem={({ item, index }) => {
                    return <Text>{String(item) + index.toString()}</Text>;
                  }}
                  ListEmptyComponent={
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          color: theme.color.appTextPrimary,
                          textAlign: "center",
                        },
                        theme.fontStyles.regular,
                      ]}
                    >
                      Sorry, there&apos;s no listing like that
                    </Text>
                  }
                />
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  paddingBottom: bottom + 32,
                  paddingHorizontal: 24,
                }}
              >
                <TextField
                  ref={searchRef}
                  autoFocus
                  placeholder="Tap to search..."
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setSearch}
                  stateValue={search}
                  clearFunc={() => {
                    setSearch("");
                    searchRef.current?.clear();
                  }}
                />
              </View>
            </KeyboardAvoidingView>
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
        {loading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color={theme.color.appTextAccent} />
            <Text
              style={{ marginTop: 12, color: theme.color.appTextSecondary }}
            >
              Loading listings...
            </Text>
          </View>
        ) : status === "error" ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text
              style={{ marginBottom: 16, color: theme.color.appTextSecondary }}
            >
              Unable to connect to server
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.color.appTextAccent,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              onPress={warmupServerManually}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isDummy ? (
          Array.from({ length: 4 }).map((_, index) => (
            <ListingCard
              key={`listitem-${index}`}
              onPress={() => {
                router.push({
                  pathname: "/listing",
                  params: { demoNumber: (index + 1).toString() },
                });
              }}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              currency="NGN"
              dateRange="12-14"
              distance="10km"
              imageUrl={`house${index + 1}`}
              location="London"
              price="5000"
              rating={4.5}
            />
          ))
        ) : (
          listings.map((listing, index) => (
            <ListingCard
              key={`listing-${listing.id || index}`}
              currency={listing.currency || "NGN"}
              dateRange={listing.dateRange || "Available"}
              distance={listing.distance || "Unknown"}
              imageUrl={listing.imageUrl || `house${(index % 4) + 1}`}
              location={listing.location || "Unknown"}
              price={listing.price || "Contact"}
              rating={listing.rating || 4.0}
            />
          ))
        )}
        <View style={{ height: 68 }} />
      </ScrollView>
    </View>
  );
};

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
