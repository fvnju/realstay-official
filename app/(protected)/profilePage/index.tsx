import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest } from "@/utils/apiClient";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Calendar,
  CaretLeft,
  CheckCircle,
  EnvelopeSimple,
  MapPin,
  PencilSimple,
  Phone,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

// Types
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  user_type: "host" | "guest";
  createdAt: string;
  image_url?: string;
  bio?: string;
  location?: string;
  verified?: boolean;
}

interface ProfileStats {
  totalBookings: number;
  totalReviews: number;
  averageRating: number;
  joinedDate: string;
}

// Profile Header Component
const ProfileHeader = ({
  userInfo,
  theme,
  onEditPress,
}: {
  userInfo: UserProfile;
  theme: any;
  onEditPress: () => void;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.profileCard}>
      <View style={componentStyles.avatarContainer}>
        <View style={componentStyles.avatar}>
          {userInfo.image_url === null ? (
            <Text style={componentStyles.avatarText}>
              {userInfo.first_name.charAt(0)}
              {userInfo.last_name.charAt(0)}
            </Text>
          ) : (
            <Image
              source={{ uri: userInfo.image_url }}
              style={{
                width: componentStyles.avatar.width,
                height: componentStyles.avatar.height,
              }}
            />
          )}
        </View>
        <TouchableOpacity
          style={componentStyles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <PencilSimple
            size={16}
            color={theme.colors.text.primary}
            weight="bold"
          />
        </TouchableOpacity>
      </View>

      <View style={componentStyles.profileInfo}>
        <View style={componentStyles.nameRow}>
          <Text style={componentStyles.userName}>
            {userInfo.first_name} {userInfo.last_name}
          </Text>
          {userInfo.verified && (
            <View style={componentStyles.verifiedBadge}>
              <CheckCircle
                size={16}
                color={theme.colors.status.success}
                weight="fill"
              />
            </View>
          )}
        </View>

        <Text style={componentStyles.userType}>
          {userInfo.user_type === "host" ? "Host" : "Guest"}
        </Text>

        {userInfo.location && (
          <View style={componentStyles.locationRow}>
            <MapPin
              size={14}
              color={theme.colors.text.secondary}
              weight="regular"
            />
            <Text style={componentStyles.locationText}>
              {userInfo.location}
            </Text>
          </View>
        )}

        {userInfo.bio && (
          <Text style={componentStyles.bioText} numberOfLines={3}>
            {userInfo.bio}
          </Text>
        )}
      </View>
    </View>
  );
};

// Stats Section Component
const StatsSection = ({
  stats,
  theme,
}: {
  stats: ProfileStats;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  const statItems = [
    { label: "Bookings", value: stats.totalBookings.toString() },
    { label: "Reviews", value: stats.totalReviews.toString() },
    {
      label: "Rating",
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A",
    },
  ];

  return (
    <View style={componentStyles.statsContainer}>
      {statItems.map((item, index) => (
        <View key={item.label} style={componentStyles.statItem}>
          <Text style={componentStyles.statValue}>{item.value}</Text>
          <Text style={componentStyles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

// Info Section Component
const InfoSection = ({
  userInfo,
  theme,
}: {
  userInfo: UserProfile;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const infoItems = [
    {
      icon: (
        <Calendar
          size={20}
          color={theme.colors.text.secondary}
          weight="regular"
        />
      ),
      label: "Member since",
      value: formatDate(userInfo.createdAt),
    },
    {
      icon: (
        <EnvelopeSimple
          size={20}
          color={theme.colors.text.secondary}
          weight="regular"
        />
      ),
      label: "Email",
      value: userInfo.email,
    },
    ...(userInfo.phone_number
      ? [
          {
            icon: (
              <Phone
                size={20}
                color={theme.colors.text.secondary}
                weight="regular"
              />
            ),
            label: "Phone",
            value: userInfo.phone_number,
          },
        ]
      : []),
  ];

  return (
    <View style={componentStyles.infoSection}>
      <Text style={componentStyles.sectionTitle}>Information</Text>
      <View style={componentStyles.infoList}>
        {infoItems.map((item, index) => (
          <View key={index} style={componentStyles.infoItem}>
            <View style={componentStyles.infoIcon}>{item.icon}</View>
            <View style={componentStyles.infoContent}>
              <Text style={componentStyles.infoLabel}>{item.label}</Text>
              <Text style={componentStyles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function ProfilePage() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProfileStats>({
    totalBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    joinedDate: "",
  });

  const loadUserProfile = useCallback(async () => {
    try {
      const userString = await SecureStore.getItemAsync("user_info");
      if (!userString) {
        router.dismissTo({ pathname: "/email" });
        return;
      }

      const localUserInfo = JSON.parse(userString);

      // Fetch fresh user data from API
      const networkData = await apiRequest(`/users/${localUserInfo.id}`, {
        requiresAuth: true,
      });

      if (networkData.status === 401) {
        await SecureStore.deleteItemAsync("access_token");
        router.dismissTo({ pathname: "/email" });
        return;
      }

      const freshUserInfo = (networkData.data as any).data.user;
      setUserInfo(freshUserInfo);

      // Mock stats - replace with actual API calls
      setStats({
        totalBookings: 12,
        totalReviews: 8,
        averageRating: 4.8,
        joinedDate: freshUserInfo.createdAt,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleEditProfile = useCallback(() => {
    // TODO: Navigate to edit profile screen
    toast.success("Edit profile coming soon!");
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) {
    return (
      <View style={[styles.container, componentStyles.loadingContainer]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.textSecondary, { marginTop: 16 }]}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={[styles.container, componentStyles.loadingContainer]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.text}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={componentStyles.header}>
        <TouchableOpacity
          style={componentStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <CaretLeft
            size={24}
            color={theme.colors.text.primary}
            weight="bold"
          />
        </TouchableOpacity>

        <Text style={componentStyles.headerTitle}>Profile</Text>

        <View style={componentStyles.headerSpacer} />
      </View>

      <ScrollView
        style={componentStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}
      >
        {/* Profile Header */}
        <ProfileHeader
          userInfo={userInfo}
          theme={theme}
          onEditPress={handleEditProfile}
        />

        {/* Stats Section */}
        <StatsSection stats={stats} theme={theme} />

        {/* Information Section */}
        <InfoSection userInfo={userInfo} theme={theme} />
      </ScrollView>
    </View>
  );
}
// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: theme.fontSizes?.h3 || 24,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
    },
    headerSpacer: {
      width: 40,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      gap: 24,
    },
    loadingContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    profileCard: {
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.xl || 16,
      padding: 24,
      alignItems: "center",
      ...(theme.shadows?.md || {}),
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors?.primary || "#0078ff",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarText: {
      fontSize: theme.fontSizes?.h1 || 34,
      ...theme.fontStyles.bold,
      color: "#ffffff",
    },
    editButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors?.border || "#e5e5ea",
    },
    profileInfo: {
      alignItems: "center",
      gap: 8,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    userName: {
      fontSize: theme.fontSizes?.h2 || 28,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
      textAlign: "center",
    },
    verifiedBadge: {
      marginLeft: 4,
    },
    userType: {
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.medium,
      color: theme.colors?.primary || "#0078ff",
      backgroundColor: theme.colors?.primary + "15" || "#0078ff15",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: theme.borderRadius?.full || 20,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    locationText: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    bioText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
      textAlign: "center",
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
      marginTop: 8,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.lg || 12,
      padding: 20,
      ...(theme.shadows?.sm || {}),
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    statValue: {
      fontSize: theme.fontSizes?.h2 || 28,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
    },
    statLabel: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    infoSection: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: theme.fontSizes?.h3 || 24,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    infoList: {
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.lg || 12,
      padding: 4,
      ...(theme.shadows?.sm || {}),
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors?.background || "#f9f9fb",
      alignItems: "center",
      justifyContent: "center",
    },
    infoContent: {
      flex: 1,
      gap: 2,
    },
    infoLabel: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    infoValue: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.medium,
    },
  });
