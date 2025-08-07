import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar, House, Plus } from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
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

import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { get } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";

// Types
interface UserInfo {
  first_name: string;
  last_name: string;
  email?: string;
  user_type?: string;
}

interface HostStats {
  listings: number;
  bookings: number;
  revenue?: number;
  rating?: number;
}

// Loading Screen Component
const LoadingScreen = ({ message }: { message: string }) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.textSecondary, { marginTop: 16 }]}>{message}</Text>
    </View>
  );
};

export default function HostDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useServerWarmup();

  const loadUserInfo = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  if (loading || status === "warming-up") {
    return (
      <LoadingScreen
        message={status === "warming-up" ? "Waking up server..." : "Loading..."}
      />
    );
  }

  const displayName = userInfo
    ? `${userInfo.first_name} ${userInfo.last_name}`
    : "Host User";

  return <HostDashboardScreen usersName={displayName} userInfo={userInfo} />;
}

interface HostDashboardScreenProps {
  usersName: string;
  userInfo: UserInfo | null;
}

const HostDashboardScreen = ({
  usersName,
  userInfo,
}: HostDashboardScreenProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { status, warmupServerManually } = useServerWarmup();
  const router = useRouter();

  // State
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<HostStats>({
    listings: 0,
    bookings: 0,
    revenue: 0,
    rating: 0,
  });

  // Fetch host data
  const fetchHostData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsResponse] = await Promise.all([
        get<{ data: [] }>("/listings", {
          requiresAuth: true,
          handleColdStart: true,
        }),
        // Add more API calls here for bookings, revenue, etc.
      ]);

      if (listingsResponse.data) {
        setListings(listingsResponse.data.data);
        setStats((prev) => ({
          ...prev,
          listings: listingsResponse.data!.data.length || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching host data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when component mounts or server becomes ready
  useEffect(() => {
    if (status === "ready") {
      fetchHostData();
    }
  }, [status, fetchHostData]);

  const handleAddListing = useCallback(
    () => {
      // router.push("/create_listing");
      toast.error("This feature is not yet available");
    },
    [
      /**router */
    ]
  );

  return (
    <View
      style={[
        styles.container,
        componentStyles.container,
        { paddingTop: top + 24 },
      ]}
    >
      {/* Header */}
      <DashboardHeader usersName={usersName} theme={theme} />

      {/* Stats Cards */}
      <StatsSection stats={stats} loading={loading} theme={theme} />

      {/* Main Content */}
      <MainContent
        stats={stats}
        loading={loading}
        status={status}
        theme={theme}
        onRetry={warmupServerManually}
      />

      {/* Floating Add Button */}
      <FloatingAddButton
        theme={theme}
        width={width}
        onPress={handleAddListing}
      />
    </View>
  );
};

// Dashboard Header Component
const DashboardHeader = ({
  usersName,
  theme,
}: {
  usersName: string;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.header}>
      <View style={componentStyles.userInfo}>
        <Text style={componentStyles.greeting}>Hello</Text>
        <View style={componentStyles.userRow}>
          <View style={componentStyles.onlineIndicator} />
          <Text style={componentStyles.userName}>{usersName}</Text>
        </View>
      </View>

      <View style={componentStyles.userTypeContainer}>
        <Text style={componentStyles.userTypeLabel}>Logged in as</Text>
        <Text style={componentStyles.userType}>host</Text>
      </View>
    </View>
  );
};

// Stats Card Component
const StatsCard = ({
  icon,
  label,
  value,
  loading,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading: boolean;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.statsCard}>
      <View style={componentStyles.statsIcon}>{icon}</View>
      <View style={componentStyles.statsContent}>
        <Text style={componentStyles.statsLabel}>{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Text style={componentStyles.statsValue}>{value}</Text>
        )}
      </View>
    </View>
  );
};

// Stats Section Component
const StatsSection = ({
  stats,
  loading,
  theme,
}: {
  stats: HostStats;
  loading: boolean;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.statsContainer}>
      <StatsCard
        icon={<House size={20} color={theme.colors.primary} weight="fill" />}
        label="Listings"
        value={stats.listings}
        loading={loading}
        theme={theme}
      />
      <StatsCard
        icon={<Calendar size={20} color={theme.colors.accent} weight="fill" />}
        label="Bookings"
        value={stats.bookings}
        loading={loading}
        theme={theme}
      />
    </View>
  );
};

// Main Content Component
const MainContent = ({
  stats,
  loading,
  status,
  theme,
  onRetry,
}: {
  stats: HostStats;
  loading: boolean;
  status: string;
  theme: any;
  onRetry: () => void;
}) => {
  const componentStyles = createComponentStyles(theme);

  if (status === "error") {
    return (
      <View style={componentStyles.centerContent}>
        <Text style={componentStyles.errorText}>
          Unable to connect to server
        </Text>
        <TouchableOpacity
          style={componentStyles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={componentStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (stats.listings === 0 && !loading) {
    return (
      <View style={componentStyles.centerContent}>
        <View style={componentStyles.emptyStateIcon}>
          <House size={64} color={theme.colors.text.secondary} weight="light" />
        </View>
        <Text style={componentStyles.emptyStateTitle}>
          Ready to start hosting?
        </Text>
        <Text style={componentStyles.emptyStateSubtitle}>
          Create your first listing and start earning from your property
        </Text>
      </View>
    );
  }

  return (
    <View style={componentStyles.centerContent}>
      <Text style={componentStyles.comingSoonText}>
        More features coming soon
      </Text>
      <Text style={componentStyles.comingSoonSubtext}>
        We're working on analytics, booking management, and more
      </Text>
    </View>
  );
};

// Floating Add Button Component
const FloatingAddButton = ({
  theme,
  width,
  onPress,
}: {
  theme: any;
  width: number;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const componentStyles = createComponentStyles(theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -50 }, { scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [scale]);

  return (
    <Animated.View
      style={[
        componentStyles.floatingButton,
        { left: width / 2 },
        animatedStyle,
      ]}
    >
      <Pressable
        style={componentStyles.floatingButtonContent}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Plus size={16} weight="bold" color={theme.colors.text.primary} />
        <Text style={componentStyles.floatingButtonText}>Add listing</Text>
      </Pressable>
    </Animated.View>
  );
};

// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 16,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    userInfo: {
      gap: 4,
    },
    greeting: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.h1 || 48,
      color: theme.colors?.text?.primary || "#000",
      letterSpacing:
        (theme.letterSpacing?.tight || -0.02) * (theme.fontSizes?.h1 || 48),
    },
    userRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    onlineIndicator: {
      backgroundColor: theme.colors?.status?.success || "#1fc16b",
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    userName: {
      ...theme.fontStyles.regular,
      color: theme.colors?.text?.primary || "#000",
      fontSize: theme.fontSizes?.sm || 14,
      lineHeight:
        (theme.fontSizes?.sm || 14) * (theme.lineHeights?.normal || 1.4),
    },
    userTypeContainer: {
      alignItems: "flex-end",
      paddingTop: 20,
    },
    userTypeLabel: {
      color: theme.colors?.text?.secondary || "#666",
      fontSize: theme.fontSizes?.sm || 14,
      ...theme.fontStyles.regular,
    },
    userType: {
      fontSize: theme.fontSizes?.h2 || 28,
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.semiBold,
    },
    statsContainer: {
      flexDirection: "row",
      gap: 16,
      marginTop: 24,
    },
    statsCard: {
      flex: 1,
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.lg || 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      ...(theme.shadows?.sm || {}),
    },
    statsIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors?.background || "#f9f9fb",
      alignItems: "center",
      justifyContent: "center",
    },
    statsContent: {
      flex: 1,
    },
    statsLabel: {
      fontSize: theme.fontSizes?.xs || 12,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.medium,
      marginBottom: 4,
    },
    statsValue: {
      fontSize: theme.fontSizes?.h3 || 24,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.bold,
    },
    centerContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    emptyStateIcon: {
      marginBottom: 24,
      opacity: 0.6,
    },
    emptyStateTitle: {
      fontSize: theme.fontSizes?.h2 || 28,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.bold,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
    comingSoonText: {
      fontSize: theme.fontSizes?.h1 || 34,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.bold,
      textAlign: "center",
      marginBottom: 12,
    },
    comingSoonSubtext: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
    errorText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: theme.colors?.primary || "#0078ff",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius?.md || 8,
    },
    retryButtonText: {
      color: "#ffffff",
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
    },
    floatingButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      zIndex: 1,
      bottom: 20,
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: 24,
      ...(theme.shadows?.md || {}),
    },
    floatingButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      gap: 8,
      flex: 1,
    },
    floatingButtonText: {
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.xs || 12,
      letterSpacing:
        (theme.letterSpacing?.loose || 0.01) * (theme.fontSizes?.xs || 12),
    },
  });
