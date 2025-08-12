import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { BookmarkSimple, MapPin, Star } from "phosphor-react-native";
import type React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ListingCardProps {
  imageUrl: string;
  dateRange: string;
  location: string;
  distance: string;
  price: string;
  currency: string;
  rating: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onPress?: () => void;
  isNew?: boolean;
  discount?: number;
  host?: {
    name: string;
    isSuperhost?: boolean;
  };
}

const ListingCard: React.FC<ListingCardProps> = ({
  imageUrl,
  dateRange,
  location,
  distance,
  price,
  currency,
  rating,
  isBookmarked = false,
  onBookmarkToggle,
  onPress,
  isNew = false,
  discount,
  host,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme, width);

  // Animation values
  const scale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleBookmarkPress = () => {
    bookmarkScale.value = withSpring(0.8, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      bookmarkScale.value = withSpring(1, { damping: 10, stiffness: 400 });
    }, 100);
    onBookmarkToggle?.();
  };
  return (
    <Animated.View style={[componentStyles.container, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image Container */}
        <View style={componentStyles.imageContainer}>
          <Image
            source={{
              uri:
                imageUrl ||
                "https://www.shutterstock.com/image-vector/bingo-lottery-balls-on-cards-600nw-2326447549.jpg",
            }}
            style={componentStyles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Overlay Content */}
          <View style={componentStyles.overlayContainer}>
            {/* Top Row */}
            <View style={componentStyles.topRow}>
              {/* Date Range Pill */}
              <BlurView style={componentStyles.dateRangePill} intensity={15}>
                <Text style={componentStyles.dateRangeText}>{dateRange}</Text>
              </BlurView>

              {/* Badges */}
              <View style={componentStyles.badgeContainer}>
                {isNew && (
                  <View style={componentStyles.newBadge}>
                    <Text style={componentStyles.newBadgeText}>NEW</Text>
                  </View>
                )}
                {discount && (
                  <View style={componentStyles.discountBadge}>
                    <Text style={componentStyles.discountText}>
                      -{discount}%
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Bookmark Button */}
            <Animated.View
              style={[componentStyles.bookmarkContainer, bookmarkAnimatedStyle]}
            >
              <TouchableOpacity
                style={componentStyles.bookmarkButton}
                onPress={handleBookmarkPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <BookmarkSimple
                  size={28}
                  weight={isBookmarked ? "fill" : "regular"}
                  color={isBookmarked ? theme.colors.accent : "#ffffff"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Content Container */}
        <View style={componentStyles.contentContainer}>
          {/* Header Row */}
          <View style={componentStyles.headerRow}>
            <View style={componentStyles.locationContainer}>
              <Text style={componentStyles.locationText} numberOfLines={1}>
                {location}
              </Text>
              <View style={componentStyles.distanceRow}>
                <MapPin
                  size={12}
                  color={theme.colors.text.secondary}
                  weight="regular"
                />
                <Text style={componentStyles.distanceText}>{distance}</Text>
              </View>
            </View>

            <View style={componentStyles.ratingContainer}>
              <Star size={16} weight="fill" color={theme.colors.accent} />
              <Text style={componentStyles.ratingText}>
                {rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Host Info */}
          {host && (
            <View style={componentStyles.hostContainer}>
              <Text style={componentStyles.hostText}>
                Hosted by {host.name}
                {host.isSuperhost && (
                  <Text style={componentStyles.superhostText}>
                    {" "}
                    • Superhost
                  </Text>
                )}
              </Text>
            </View>
          )}

          {/* Price Row */}
          <View style={componentStyles.priceRow}>
            <View style={componentStyles.priceContainer}>
              {discount && (
                <Text style={componentStyles.originalPrice}>
                  {currency}{" "}
                  {Math.round(
                    parseInt(price) * (1 + discount / 100)
                  ).toLocaleString()}
                </Text>
              )}
              <Text style={componentStyles.priceText}>
                {currency} {parseInt(price).toLocaleString()}
                <Text style={componentStyles.nightText}> / night</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ListingCard;
// Component styles
const createComponentStyles = (theme: any, width: number) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.xl || 16,
      overflow: "hidden",
      ...(theme.shadows?.md || {}),
    },
    imageContainer: {
      position: "relative",
      height: 240,
      overflow: "hidden",
    },
    image: {
      flex: 1,
      borderTopLeftRadius: theme.borderRadius?.xl || 16,
      borderTopRightRadius: theme.borderRadius?.xl || 16,
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 16,
      justifyContent: "space-between",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    dateRangePill: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius?.full || 20,
      overflow: "hidden",
    },
    dateRangeText: {
      fontSize: theme.fontSizes?.xs || 12,
      ...theme.fontStyles.semiBold,
      color: "#ffffff",
    },
    badgeContainer: {
      gap: 8,
    },
    newBadge: {
      backgroundColor: theme.colors?.status?.success || "#1fc16b",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius?.sm || 4,
    },
    newBadgeText: {
      fontSize: theme.fontSizes?.xxs || 10,
      ...theme.fontStyles.bold,
      color: "#ffffff",
    },
    discountBadge: {
      backgroundColor: theme.colors?.status?.error || "#d00416",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius?.sm || 4,
    },
    discountText: {
      fontSize: theme.fontSizes?.xxs || 10,
      ...theme.fontStyles.bold,
      color: "#ffffff",
    },
    bookmarkContainer: {
      position: "absolute",
      top: 16,
      right: 16,
    },
    bookmarkButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(10px)",
    },
    gradientOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
    },
    contentContainer: {
      padding: 16,
      gap: 8,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    locationContainer: {
      flex: 1,
      marginRight: 12,
    },
    locationText: {
      fontSize: theme.fontSizes?.lg || 18,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
      marginBottom: 4,
    },
    distanceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    distanceText: {
      fontSize: theme.fontSizes?.xs || 12,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: theme.colors?.background || "#f9f9fb",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius?.sm || 4,
    },
    ratingText: {
      fontSize: theme.fontSizes?.sm || 14,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    hostContainer: {
      marginTop: 4,
    },
    hostText: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    superhostText: {
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.medium,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 8,
    },
    priceContainer: {
      flex: 1,
    },
    originalPrice: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textDecorationLine: "line-through",
      marginBottom: 2,
    },
    priceText: {
      fontSize: theme.fontSizes?.lg || 18,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
    },
    nightText: {
      ...theme.fontStyles.regular,
      color: theme.colors?.text?.secondary || "#666",
      fontSize: theme.fontSizes?.sm || 14,
    },
  });
