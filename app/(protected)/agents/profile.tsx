import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSetAtom } from "jotai";
import {
  CaretRight,
  LockKey,
  SignOut,
  SunHorizon,
  Wallet,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { avoid_redirect_to_agent } from "../_layout";

// Types
interface UserInfo {
  first_name: string;
  last_name: string;
  email?: string;
  user_type?: "host" | "guest";
}

interface SettingsItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

// Profile Header Component
const ProfileHeader = ({
  userInfo,
  theme,
  onPress,
}: {
  userInfo: UserInfo;
  theme: any;
  onPress: () => void;
}) => {
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.profileCard}>
      <TouchableOpacity
        style={componentStyles.profileButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={componentStyles.avatar}>
          <Text style={componentStyles.avatarText}>
            {userInfo.first_name.charAt(0)}
            {userInfo.last_name.charAt(0)}
          </Text>
        </View>

        <View style={componentStyles.userInfo}>
          <Text style={componentStyles.userName}>
            {`${userInfo.first_name} ${userInfo.last_name}`}
          </Text>
          <Text style={styles.textSecondary}>Show your profile</Text>
        </View>

        <CaretRight
          weight="bold"
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};

// Host Switch Component
const HostSwitch = ({
  theme,
  onPress,
}: {
  theme: any;
  onPress: () => void;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.hostSwitchContainer}>
      <TouchableOpacity
        style={componentStyles.hostSwitch}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={componentStyles.hostSwitchText}>Switch to geust</Text>
      </TouchableOpacity>
    </View>
  );
};

// Settings Item Component
const SettingsItemComponent = ({
  item,
  theme,
}: {
  item: SettingsItem;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <TouchableOpacity
      style={componentStyles.settingsItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      {item.icon}
      <Text style={componentStyles.settingsItemText}>{item.title}</Text>
      <CaretRight weight="bold" size={20} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );
};

export default function Profile() {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const router = useRouter();
  const set_avoid_redirect = useSetAtom(avoid_redirect_to_agent);

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user info
  const loadUserInfo = useCallback(async () => {
    try {
      const userString = await SecureStore.getItemAsync("user_info");
      if (userString) {
        setUserInfo(JSON.parse(userString));
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      toast.error("Failed to load user information");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  // Handle logout
  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("user_info");
            await SecureStore.deleteItemAsync("access_token");
            router.dismissTo("/email");
            toast.success("Logged out successfully");
          } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
          }
        },
      },
    ]);
  }, [router]);

  // Handle host switch
  const handleHostSwitch = useCallback(() => {
    set_avoid_redirect(false);
    router.replace({ pathname: "/" });
  }, [set_avoid_redirect, router]);

  // Settings items configuration
  const settingsItems: SettingsItem[] = [
    {
      id: "appearance",
      title: "Appearance",
      icon: (
        <SunHorizon
          size={24}
          weight="regular"
          color={theme.colors.text.primary}
        />
      ),
      onPress: () => router.push("/appearance"),
    },
    {
      id: "payments",
      title: "Payments and billing",
      icon: (
        <Wallet size={24} weight="regular" color={theme.colors.text.primary} />
      ),
      onPress: () => router.push("/paymentsAndBilling"),
    },
    {
      id: "security",
      title: "Login and security",
      icon: (
        <LockKey size={24} weight="regular" color={theme.colors.text.primary} />
      ),
      onPress: () => router.push("/loginAndSecurity"),
    },
  ];

  if (isLoading || !userInfo) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.textSecondary}>Loading...</Text>
      </View>
    );
  }

  const isHost = userInfo.user_type === "host";

  return (
    <View
      style={[
        styles.container,
        componentStyles.container,
        { paddingTop: top + 24 },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}
      >
        {/* Page Title */}
        <Text style={componentStyles.pageTitle}>Profile</Text>

        {/* Profile Header */}
        <ProfileHeader
          userInfo={userInfo}
          theme={theme}
          onPress={() => router.push({ pathname: "/profilePage" })}
        />

        {/* Host Switch (if user is host) */}
        {isHost && <HostSwitch theme={theme} onPress={handleHostSwitch} />}

        {/* Settings Section */}
        <Text style={componentStyles.sectionTitle}>Settings</Text>

        <View style={componentStyles.settingsContainer}>
          {settingsItems.map((item) => (
            <SettingsItemComponent key={item.id} item={item} theme={theme} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={componentStyles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <SignOut
            size={20}
            color={theme.colors.status.error}
            weight="regular"
          />
          <Text style={componentStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    pageTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.h2,
      color: theme.colors.text.primary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.h2,
      marginBottom: 24,
    },
    sectionTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.h2,
      color: theme.colors.text.primary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.h2,
      marginTop: 32,
      marginBottom: 20,
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      ...theme.shadows.sm,
    },
    profileButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: "#ffffff",
      fontSize: theme.fontSizes.lg,
      ...theme.fontStyles.semiBold,
    },
    userInfo: {
      flex: 1,
      gap: 4,
    },
    userName: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
      lineHeight: theme.fontSizes.base * theme.lineHeights.normal,
    },
    hostSwitchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 0,
      marginBottom: 8,
      ...theme.shadows.sm,
      alignSelf: "flex-start",
    },
    hostSwitch: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.primary + "15",
      alignSelf: "flex-start",
    },
    hostSwitchText: {
      ...theme.fontStyles.medium,
      color: theme.colors.primary,
      fontSize: theme.fontSizes.sm,
    },
    settingsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 4,
      ...theme.shadows.sm,
    },
    settingsItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginVertical: 2,
    },
    settingsItemText: {
      ...theme.fontStyles.medium,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: theme.fontSizes.base * theme.lineHeights.normal,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 32,
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      ...theme.shadows.sm,
    },
    logoutText: {
      color: theme.colors.status.error,
      ...theme.fontStyles.medium,
      fontSize: theme.fontSizes.base,
    },
  });
