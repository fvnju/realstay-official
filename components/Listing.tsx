import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Heart, Share, Star, User, WifiX as Wifi } from "phosphor-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types for the component props
export interface ListingProps {
  title: string;
  propertyType: string;
  address: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  price: number;
  paymentCycle: string;
  description: string;
  amenities: string[];
  photos: Array<{ uri: string; id: string }>;
  currency?: string;
  guests?: number;
  rating?: number;
  reviewCount?: number;
  host?: {
    name: string;
    avatar?: string;
    joinDate: string;
    isSuperhost?: boolean;
  };
  reviews?: Array<{
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  showActions?: boolean;
  showBottomBar?: boolean;
  onShare?: () => void;
  onFavorite?: () => void;
  onReserve?: () => void;
}

// Header Component
const ListingHeader = ({
  imageUri,
  theme,
  showActions = true,
  onShare,
  onFavorite,
}: {
  imageUri: string;
  theme: any;
  showActions?: boolean;
  onShare?: () => void;
  onFavorite?: () => void;
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

      {showActions && (
        <View style={componentStyles.headerOverlay}>
          <View style={componentStyles.headerActions}>
            <TouchableOpacity
              style={componentStyles.actionButton}
              onPress={onShare}
            >
              <Share
                size={20}
                color={theme.colors.text.primary}
                weight="regular"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={componentStyles.actionButton}
              onPress={onFavorite}
            >
              <Heart
                size={20}
                color={theme.colors.text.primary}
                weight="regular"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Listing Info Component
const ListingInfo = ({
  listing,
  theme,
  showHost = true,
  showReviews = true,
}: {
  listing: ListingProps;
  theme: any;
  showHost?: boolean;
  showReviews?: boolean;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.infoContainer}>
      {/* Title Section */}
      <View style={componentStyles.titleSection}>
        <Text style={componentStyles.title}>{listing.title}</Text>

        <Text style={componentStyles.subtitle}>
          {listing.propertyType} in {listing.address}, {listing.state}
        </Text>

        <Text style={componentStyles.details}>
          {listing.guests || 4} guests · {listing.bedrooms} bedrooms ·{" "}
          {listing.beds} beds · {listing.bathrooms} bathrooms
        </Text>
      </View>

      {/* Rating Section */}
      {listing.rating && listing.reviewCount && (
        <View style={componentStyles.ratingSection}>
          <Star size={16} weight="fill" color={theme.colors.accent} />
          <Text style={componentStyles.ratingText}>
            {listing.rating.toFixed(2)} · {listing.reviewCount} reviews
          </Text>
        </View>
      )}

      {/* Host Section */}
      {showHost && listing.host && (
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
      )}

      {/* Description Section */}
      <View style={componentStyles.descriptionSection}>
        <Text style={componentStyles.description} numberOfLines={6}>
          {listing.description}
        </Text>
      </View>

      {/* Reviews Section */}
      {showReviews && listing.reviews && listing.reviews.length > 0 && (
        <View style={componentStyles.reviewsSection}>
          <View style={componentStyles.reviewsHeader}>
            <Text style={componentStyles.sectionTitle}>
              Reviews ({listing.reviewCount || listing.reviews.length})
            </Text>
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
      )}

      {/* Amenities Section */}
      {listing.amenities && listing.amenities.length > 0 && (
        <View style={componentStyles.amenitiesSection}>
          <Text style={componentStyles.sectionTitle}>
            What this place offers
          </Text>
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
      )}
    </View>
  );
};

// Bottom Bar Component
const BottomBar = ({
  listing,
  onReserve,
  theme,
}: {
  listing: ListingProps;
  onReserve?: () => void;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.bottomBar}>
      <View style={componentStyles.priceSection}>
        <View style={componentStyles.priceContainer}>
          <View style={componentStyles.priceRow}>
            <Text style={componentStyles.priceText}>
              {listing.currency || "₦"}
              {listing.price.toLocaleString()}
            </Text>
            <Text style={componentStyles.priceSubtext}>
              / {listing.paymentCycle}
            </Text>
          </View>
        </View>
      </View>

      {onReserve && (
        <TouchableOpacity
          style={componentStyles.reserveButton}
          onPress={onReserve}
          activeOpacity={0.9}
        >
          <Text style={componentStyles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function Listing({
  title,
  propertyType,
  address,
  state,
  bedrooms,
  bathrooms,
  beds,
  price,
  paymentCycle,
  description,
  amenities,
  photos,
  currency = "₦",
  guests = 4,
  rating,
  reviewCount,
  host,
  reviews,
  showActions = true,
  showBottomBar = true,
  onShare,
  onFavorite,
  onReserve,
}: ListingProps) {
  const theme = useTheme();
  const componentStyles = createComponentStyles(theme);

  const listingData: ListingProps = {
    title,
    propertyType,
    address,
    state,
    bedrooms,
    bathrooms,
    beds,
    price,
    paymentCycle,
    description,
    amenities,
    photos,
    currency,
    guests,
    rating,
    reviewCount,
    host,
    reviews,
  };

  return (
    <View style={componentStyles.container}>
      {/* Header with Image */}
      <ListingHeader
        imageUri={photos[0]?.uri || ""}
        theme={theme}
        showActions={showActions}
        onShare={onShare}
        onFavorite={onFavorite}
      />

      {/* Content */}
      <ScrollView
        style={componentStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}
      >
        <ListingInfo
          listing={listingData}
          theme={theme}
          showHost={!!host}
          showReviews={!!reviews && reviews.length > 0}
        />
      </ScrollView>

      {/* Bottom Bar */}
      {showBottomBar && (
        <BottomBar listing={listingData} onReserve={onReserve} theme={theme} />
      )}
    </View>
  );
}

// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.appBackground || "#f8f9fa",
    },
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
      right: 16,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
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
      paddingBottom: 20,
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
