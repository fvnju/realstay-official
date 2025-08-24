import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import {
  CaretLeft,
  Heart,
  Share,
  Star,
  User,
  WifiX as Wifi,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator, BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { get } from "@/utils/apiClient";
import { jwtAtom } from "@/utils/jwt";
import { $preventDoubleNav } from "../(tabs)";

// Types
interface Owner {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  user_type: string;
  image_url?: string;
  status: string;
  createdAt: string;
}

interface ApiListingData {
  _id: string;
  place_holder_address: string;
  google_formatted_address: string;
  owner_id: string;
  state: string;
  lga: string;
  lat: number;
  lng: number;
  type: string;
  no_of_beds: number;
  are_pets_allowed: boolean;
  no_of_bedrooms: number;
  no_of_bathrooms: number;
  are_parties_allowed: boolean;
  extra_offerings: string[];
  title: string;
  description: string;
  cost: number;
  cost_cycle: string;
  photos: string[];
  status: string;
  owner: Owner;
  average_rating: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ListingData {
  id: string;
  owner_id: string;
  title: string;
  type: string;
  location: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  description: string;
  host: {
    name: string;
    avatar?: string;
    joinDate: string;
    isSuperhost?: boolean;
  };
  amenities: string[];
  images: string[];
  petsAllowed: boolean;
  partiesAllowed: boolean;
  costCycle: string;
}

interface ApiResponse {
  data: ApiListingData;
  success: boolean;
}

// Transform API data to UI format
const transformListingData = (apiData: ApiListingData): ListingData => {
  const joinDate = new Date(apiData.owner.createdAt);
  const monthsAgo = Math.floor(
    (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return {
    id: apiData._id,
    owner_id: apiData.owner_id,
    title: apiData.title,
    type: apiData.type,
    location: apiData.place_holder_address,
    guests: apiData.no_of_beds, // Assuming beds can accommodate guests
    bedrooms: apiData.no_of_bedrooms,
    beds: apiData.no_of_beds,
    bathrooms: apiData.no_of_bathrooms,
    rating: apiData.average_rating || 4.0,
    reviewCount: 0, // No review count in API response
    price: apiData.cost,
    currency: "₦",
    description: apiData.description,
    host: {
      name: `${apiData.owner.first_name} ${apiData.owner.last_name}`,
      avatar: apiData.owner.image_url,
      joinDate: `${monthsAgo} months on this app`,
      isSuperhost: apiData.owner.user_type === "host",
    },
    amenities: apiData.extra_offerings,
    images: apiData.photos.length > 0 ? apiData.photos : ["house1"],
    petsAllowed: apiData.are_pets_allowed,
    partiesAllowed: apiData.are_parties_allowed,
    costCycle: apiData.cost_cycle,
  };
};

// Loading Component
const LoadingScreen = ({ theme }: { theme: any }) => {
  const styles = createThemedStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.textSecondary, { marginTop: 16 }]}>
        Loading listing...
      </Text>
    </View>
  );
};

// Error Component
const ErrorScreen = ({
  theme,
  onRetry,
}: {
  theme: any;
  onRetry: () => void;
}) => {
  const styles = createThemedStyles(theme);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
            textAlign: "center",
          },
        ]}
      >
        Failed to load listing
      </Text>
      <Text
        style={[
          styles.textSecondary,
          { marginBottom: 16, textAlign: "center" },
        ]}
      >
        Please check your connection and try again
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

// Header Component
const ListingHeader = ({
  imageUri,
  onBack,
  theme,
}: {
  imageUri: string;
  onBack: () => void;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.headerContainer}>
      <Image
        style={componentStyles.headerImage}
        source={{
          uri: "http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ1FM_ID8fbFHo8KICi9j9-CNu07av6aRQ0K1I2F_hrw5KatF4CsuMyLpCqiU90rvzZ0fn2W0Bn7NpmjW7K5Zc",
        }}
        contentFit="cover"
        transition={200}
      />

      <View style={componentStyles.headerOverlay}>
        <TouchableOpacity
          style={componentStyles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <CaretLeft
            size={20}
            weight="bold"
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <View style={componentStyles.headerActions}>
          <TouchableOpacity style={componentStyles.actionButton}>
            <Share
              size={20}
              color={theme.colors.text.primary}
              weight="regular"
            />
          </TouchableOpacity>
          <TouchableOpacity style={componentStyles.actionButton}>
            <Heart
              size={20}
              color={theme.colors.text.primary}
              weight="regular"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Listing Info Component
const ListingInfo = ({
  listing,
  theme,
  onShowMore,
  onShowAllReviews,
}: {
  listing: ListingData;
  theme: any;
  onShowMore: () => void;
  onShowAllReviews: () => void;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.infoContainer}>
      {/* Title Section */}
      <View style={componentStyles.titleSection}>
        <Text style={componentStyles.title}>{listing.title}</Text>

        <Text style={componentStyles.subtitle}>
          {listing.type} in {listing.location}
        </Text>

        <Text style={componentStyles.details}>
          {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds}{" "}
          beds · {listing.bathrooms} bathrooms
        </Text>
      </View>

      {/* Rating Section */}
      <View style={componentStyles.ratingSection}>
        <Star size={16} weight="fill" color={theme.colors.accent} />
        <Text style={componentStyles.ratingText}>
          {listing.rating.toFixed(1)} rating
        </Text>
      </View>

      {/* Host Section */}
      <View style={componentStyles.hostSection}>
        <View style={componentStyles.hostAvatar}>
          <User size={24} color={theme.colors.text.inverse} weight="fill" />
        </View>
        <View style={componentStyles.hostInfo}>
          <Text style={componentStyles.hostName}>
            Hosted by {listing.host.name}
            {listing.host.isSuperhost && (
              <Text style={componentStyles.superhostBadge}> · Superhost</Text>
            )}
          </Text>
          <Text style={componentStyles.hostJoinDate}>
            {listing.host.joinDate}
          </Text>
        </View>
      </View>

      {/* Description Section */}
      <View style={componentStyles.descriptionSection}>
        <Text style={componentStyles.description} numberOfLines={6}>
          {listing.description}
        </Text>
        <TouchableOpacity
          onPress={onShowMore}
          style={componentStyles.showMoreButton}
        >
          <Text style={componentStyles.showMoreText}>Show more</Text>
        </TouchableOpacity>
      </View>

      {/* Property Rules Section */}
      <View style={componentStyles.rulesSection}>
        <Text style={componentStyles.sectionTitle}>House rules</Text>
        <View style={componentStyles.rulesGrid}>
          <View style={componentStyles.ruleItem}>
            <Text style={componentStyles.ruleText}>
              Pets {listing.petsAllowed ? "allowed" : "not allowed"}
            </Text>
          </View>
          <View style={componentStyles.ruleItem}>
            <Text style={componentStyles.ruleText}>
              Parties {listing.partiesAllowed ? "allowed" : "not allowed"}
            </Text>
          </View>
        </View>
      </View>

      {/* Amenities Section */}
      <View style={componentStyles.amenitiesSection}>
        <Text style={componentStyles.sectionTitle}>What this place offers</Text>
        <View style={componentStyles.amenitiesGrid}>
          {listing.amenities.map((amenity, index) => (
            <View
              key={index}
              style={[
                componentStyles.amenityItem,
                index === listing.amenities.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Wifi
                size={24}
                color={theme.colors.text.primary}
                weight="regular"
              />
              <Text style={componentStyles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Bottom Bar Component
const BottomBar = ({
  listing,
  onReserve,
  theme,
  bottom,
}: {
  listing: ListingData;
  onReserve: () => void;
  theme: any;
  bottom: number;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={[componentStyles.bottomBar, { paddingBottom: bottom + 20 }]}>
      <View style={componentStyles.priceSection}>
        <View style={componentStyles.priceContainer}>
          <View style={componentStyles.priceRow}>
            <Text style={componentStyles.priceText}>
              {listing.currency}
              {listing.price.toLocaleString()}
            </Text>
            <Text style={componentStyles.priceSubtext}>
              / {listing.costCycle}
            </Text>
          </View>
          <View style={componentStyles.totalRow}>
            <Text style={componentStyles.totalText}>Total before taxes</Text>
            <TouchableOpacity>
              <Text style={componentStyles.underlineText}>See breakdown</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={componentStyles.reserveButton}
        onPress={onReserve}
        activeOpacity={0.9}
      >
        <Text style={componentStyles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    </View>
  );
};

import { AppleMaps, GoogleMaps } from 'expo-maps';

export default function ListingScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { demoNumber, id } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const token = useAtomValue(jwtAtom);

    useEffect(() => {
        const subscription = BackHandler.addEventListener("hardwareBackPress", ()=>{
            $preventDoubleNav.set(false);
            router.back();
            return true;
        })

        return () => subscription.remove();
    }, [router]);

  // State
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch listing data
  const fetchListing = useCallback(async () => {
    if (!id && !demoNumber) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const listingId = id || demoNumber;
      const response = await get<any>(`/listing/${listingId}`, {
        requiresAuth: true,
      });

      if (response.data?.data) {
        const transformedListing = transformListingData(response.data.data);
        setListing(transformedListing);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      setError(true);
      toast.error("Failed to load listing");
    } finally {
      setLoading(false);
    }
  }, [id, demoNumber]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleBack = useCallback(() => {
    $preventDoubleNav.set(false);
    router.back();
  }, [router]);

  const handleReserve = useCallback(() => {
    if (!listing) return;

    $preventDoubleNav.set(false)

    router.replace({
      pathname: `/chat/${listing.owner_id}` as any, // You might want to use owner ID instead
      params: {
        initialMessage: "I want to reserve a property of yours",
      },
    });
  }, [router, listing]);

  const handleShowMore = useCallback(() => {
    setShowFullDescription(true);
  }, []);

  const handleShowAllReviews = useCallback(() => {
    if (!listing) return;

    router.push({
      pathname: "/listing/reviews",
      params: { listingId: listing.id },
    });
  }, [router, listing]);

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: top + 12 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingScreen theme={theme} />
      </View>
    );
  }

  // Show error state
  if (error || !listing) {
    return (
      <View style={[styles.container, { paddingTop: top + 12 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorScreen theme={theme} onRetry={fetchListing} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top + 12 }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Image */}
      <ListingHeader
        imageUri={listing.images[0]}
        onBack={handleBack}
        theme={theme}
      />

      {/* Content */}
      <ScrollView
        style={componentStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}
      >
        <ListingInfo
          listing={listing}
          theme={theme}
          onShowMore={handleShowMore}
          onShowAllReviews={handleShowAllReviews}
        />
      </ScrollView>

      {/* Bottom Bar */}
      <BottomBar
        listing={listing}
        onReserve={handleReserve}
        theme={theme}
        bottom={bottom}
      />
    </View>
  );
}
// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "relative",
      height: 280,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    headerImage: {
      flex: 1,
      borderRadius: theme.borderRadius?.xl || 16,
    },
    headerOverlay: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    backButton: {
      backgroundColor: theme.colors?.surface || "#ffffff",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      ...(theme.shadows?.sm || {}),
    },
    headerActions: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      backgroundColor: theme.colors?.surface || "#ffffff",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      ...(theme.shadows?.sm || {}),
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    infoContainer: {
      paddingHorizontal: 20,
      gap: 20,
    },
    titleSection: {
      gap: 12,
      marginBottom: 8,
    },
    title: {
      fontSize: theme.fontSizes?.h2 || 28,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
      lineHeight:
        (theme.fontSizes?.h2 || 28) * (theme.lineHeights?.tight || 1.2),
    },
    subtitle: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.medium,
    },
    details: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    ratingSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      backgroundColor: "rgba(255, 152, 0, 0.1)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.borderRadius?.full || 20,
      marginTop: -4,
    },
    ratingText: {
      fontSize: theme.fontSizes?.sm || 14,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    hostSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.xl || 16,
      ...(theme.shadows?.md || {}),
    },
    hostAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors?.primary || "#0078ff",
      alignItems: "center",
      justifyContent: "center",
    },
    hostInfo: {
      flex: 1,
      gap: 4,
    },
    hostName: {
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    superhostBadge: {
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.medium,
    },
    hostJoinDate: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    descriptionSection: {
      gap: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.xl || 16,
      ...(theme.shadows?.sm || {}),
    },
    description: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
    showMoreButton: {
      alignSelf: "flex-start",
    },
    showMoreText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.semiBold,
      textDecorationLine: "underline",
    },
    amenitiesSection: {
      gap: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.xl || 16,
      ...(theme.shadows?.sm || {}),
    },
    sectionTitle: {
      fontSize: theme.fontSizes?.h3 || 24,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    amenitiesGrid: {
      gap: 12,
    },
    amenityItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    amenityText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
    },
    bottomBar: {
      backgroundColor: theme.colors?.surface
        ? `${theme.colors.surface}CC`
        : "#ffffffCC",
      paddingHorizontal: 20,
      paddingTop: 24,
      flexDirection: "column",
      gap: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors?.border || "#e5e5ea",
      ...(theme.shadows?.lg || {}),
    },
    priceSection: {
      width: "100%",
    },
    priceContainer: {
      gap: 8,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
    },
    priceText: {
      fontSize: theme.fontSizes?.h2 || 28,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
    },
    priceSubtext: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalText: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    underlineText: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.medium,
      textDecorationLine: "underline",
    },
    reserveButton: {
      backgroundColor: theme.colors?.primary || "#0078ff",
      paddingVertical: 16,
      borderRadius: theme.borderRadius?.lg || 12,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      ...(theme.shadows?.md || {}),
    },
    reserveButtonText: {
      fontSize: theme.fontSizes?.lg || 18,
      ...theme.fontStyles.bold,
      color: "#ffffff",
    },
    reviewsSection: {
      gap: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.xl || 16,
      ...(theme.shadows?.sm || {}),
    },
    reviewsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    showAllText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.semiBold,
      textDecorationLine: "underline",
    },
    reviewsGrid: {
      gap: 16,
    },
    reviewItem: {
      gap: 12,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reviewerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors?.primary || "#0078ff",
      alignItems: "center",
      justifyContent: "center",
    },
    reviewerInfo: {
      flex: 1,
      gap: 4,
    },
    reviewerName: {
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    reviewMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    reviewRating: {
      flexDirection: "row",
      gap: 2,
    },
    reviewDate: {
      fontSize: theme.fontSizes?.xs || 12,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    rulesSection: {
      gap: 16,
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.xl || 16,
      ...(theme.shadows?.sm || {}),
    },
    rulesGrid: {
      gap: 12,
    },
    ruleItem: {
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    ruleText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
    },
  });
