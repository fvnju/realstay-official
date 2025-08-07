import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  CaretLeft,
  Heart,
  Share,
  Star,
  User,
  WifiX as Wifi,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

interface ListingData {
  id: string;
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
  reviews: Review[];
}

// Mock data - replace with API call
const getMockListingData = (demoNumber?: string): ListingData => ({
  id: demoNumber || "1",
  title: "Spacious 2-Bedroom Apartment for Rent",
  type: "Apartment",
  location: "Kubwa, Abuja",
  guests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 2,
  rating: 4.81,
  reviewCount: 20,
  price: 50000,
  currency: "₦",
  description:
    "Welcome to your home away from home! This stylish 2-bedroom, 2-bathroom apartment offers the perfect blend of comfort and sophistication in the bustling heart of the city. Located on the 8th floor of a modern high-rise, this spacious 1,200 square-foot apartment features floor-to-ceiling windows that bathe the interior in natural light and provide sweeping views of the skyline.",
  host: {
    name: "Paul Illoris",
    joinDate: "5 months on this app",
    isSuperhost: false,
  },
  amenities: ["WiFi", "Kitchen", "Air conditioning", "Parking"],
  images: [demoNumber ? `house${demoNumber}` : "house1"],
  reviews: [
    {
      id: "1",
      userName: "Sarah Johnson",
      rating: 5,
      date: "December 2024",
      comment:
        "Amazing place! The apartment was exactly as described and the host was very responsive. The location is perfect and the amenities were great. Highly recommend!",
    },
    {
      id: "2",
      userName: "Michael Chen",
      rating: 4,
      date: "November 2024",
      comment:
        "Great stay overall. The apartment is spacious and well-maintained. Only minor issue was the WiFi speed, but everything else was perfect.",
    },
    {
      id: "3",
      userName: "Emma Williams",
      rating: 5,
      date: "October 2024",
      comment:
        "Loved our stay here! The apartment is beautiful and the host Paul was incredibly helpful. Will definitely book again.",
    },
  ],
});

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
        source={{ uri: imageUri }}
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
      <TouchableOpacity
        style={componentStyles.ratingSection}
        onPress={onShowAllReviews}
        activeOpacity={0.7}
      >
        <Star size={16} weight="fill" color={theme.colors.accent} />
        <Text style={componentStyles.ratingText}>
          {listing.rating.toFixed(2)} · {listing.reviewCount} reviews
        </Text>
      </TouchableOpacity>

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

      {/* Reviews Section */}
      <View style={componentStyles.reviewsSection}>
        <View style={componentStyles.reviewsHeader}>
          <Text style={componentStyles.sectionTitle}>
            Reviews ({listing.reviewCount})
          </Text>
          <TouchableOpacity onPress={onShowAllReviews}>
            <Text style={componentStyles.showAllText}>Show all</Text>
          </TouchableOpacity>
        </View>

        <View style={componentStyles.reviewsGrid}>
          {listing.reviews.slice(0, 2).map((review) => (
            <View key={review.id} style={componentStyles.reviewItem}>
              <View style={componentStyles.reviewHeader}>
                <View style={componentStyles.reviewerAvatar}>
                  <User
                    size={20}
                    color={theme.colors.text.inverse}
                    weight="fill"
                  />
                </View>
                <View style={componentStyles.reviewerInfo}>
                  <Text style={componentStyles.reviewerName}>
                    {review.userName}
                  </Text>
                  <View style={componentStyles.reviewMeta}>
                    <View style={componentStyles.reviewRating}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={12}
                          weight="fill"
                          color={
                            index < review.rating
                              ? theme.colors.accent
                              : theme.colors.border
                          }
                        />
                      ))}
                    </View>
                    <Text style={componentStyles.reviewDate}>
                      {review.date}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={componentStyles.reviewComment} numberOfLines={3}>
                {review.comment}
              </Text>
            </View>
          ))}
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
            <Text style={componentStyles.priceSubtext}>/ night</Text>
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

export default function ListingScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { demoNumber } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [listing] = useState<ListingData>(() =>
    getMockListingData(demoNumber as string)
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleReserve = useCallback(() => {
    router.back();
    router.navigate({
      pathname: `/chat/6813b689f7369be5c71df81d` as any,
    });
  }, [router]);

  const handleShowMore = useCallback(() => {
    setShowFullDescription(true);
  }, []);

  const handleShowAllReviews = useCallback(() => {
    router.push({
      pathname: "/listing/reviews",
      params: { listingId: listing.id },
    });
  }, [router, listing.id]);

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
    reviewComment: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
      lineHeight:
        (theme.fontSizes?.sm || 14) * (theme.lineHeights?.relaxed || 1.6),
    },
  });
