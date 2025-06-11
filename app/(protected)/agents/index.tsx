import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { useTheme } from "@/hooks/useTheme";
import { get } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";

import * as SecureStore from "expo-secure-store";
import { Bed, Plus, SuitcaseRolling } from "phosphor-react-native";

import {
  ActivityIndicator,
  Pressable,
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
  const styles = styleSheet();
  const { background, text, text_2, heading } = styles;
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const { status, warmupServerManually } = useServerWarmup();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      <View style={{ flexDirection: "row", marginTop: 16, gap: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Bed color={theme.color.appTextPrimary} weight="light" size={24} />
          <Text
            style={[
              { fontSize: 14, color: theme.color.appTextPrimary },
              theme.fontStyles.regular,
            ]}
          >
            {0} Listings
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <SuitcaseRolling
            color={theme.color.appTextPrimary}
            weight="light"
            size={24}
          />
          <Text
            style={[
              { fontSize: 14, color: theme.color.appTextPrimary },
              theme.fontStyles.regular,
            ]}
          >
            {0} Bookings
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={[
            {
              fontSize: 48,
              color: theme.color.appTextPrimary,
              textAlign: "center",
            },
            theme.fontStyles.bold,
          ]}
        >
          More will be added soon.
        </Text>
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
            router.push("/create_listing");
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
