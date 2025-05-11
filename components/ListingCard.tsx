import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Bookmark, BookmarkSimple, Star } from "phosphor-react-native";
import type React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";

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
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16 * 2,
    },
    imageContainer: {
      position: "relative",
      height: 220,
    },
    image: {
      flex: 1,
      borderRadius: 32,
    },
    dateRangePill: {
      backgroundColor: theme.color.appDropShadow,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      overflow: "hidden",
    },
    dateRangeText: {
      fontSize: theme.fontSizes.sm,
      ...theme.fontStyles.medium,
      color: theme.color.elementsButtonText,
    },
    contentContainer: {
      paddingTop: 12,
      paddingHorizontal: 8,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    locationText: {
      fontSize: theme.fontSizes.lg,
      ...theme.fontStyles.semiBold,
      color: theme.color.appTextPrimary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.lg,
    },
    distanceText: {
      fontSize: theme.fontSizes.xs,
      color: theme.color.appTextSecondary,
      marginTop: 4,
      ...theme.fontStyles.regular,
      letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      fontSize: theme.fontSizes.base,
      ...theme.fontStyles.semiBold,
      color: theme.color.appTextAccent,
      letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.base,
      marginLeft: 4,
    },
    priceContainer: {
      marginTop: 8,
    },
    priceText: {
      fontSize: theme.fontSizes.base,
      ...theme.fontStyles.semiBold,
      color: theme.color.appTextPrimary,
      letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.base,
    },
    nightText: {
      ...theme.fontStyles.regular,
      color: theme.color.appTextSecondary,
      fontSize: theme.fontSizes.xs,
      letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
    },
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
        />

        <View
          style={{
            width: width - 16 * 2 - 16 * 2,
            position: "absolute",
            top: 16,
            left: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Date Range Pill */}
          <BlurView style={styles.dateRangePill} intensity={10}>
            <Text style={styles.dateRangeText}>{dateRange}</Text>
          </BlurView>

          {/* Bookmark Button */}
          <TouchableOpacity onPress={onBookmarkToggle}>
            <BookmarkSimple
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 2.4,
                elevation: 4,
              }}
              size={32}
              weight="duotone"
              color={isBookmarked ? "#FF9800" : "#E8E8E8"}
              duotoneColor={isBookmarked ? "#FFBA55" : "#FFFFFF"}
              duotoneOpacity={1}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.locationText}>{location}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={24} weight="fill" color={theme.color.appTextAccent} />
            <Text style={styles.ratingText}>{rating.toFixed(2)}</Text>
          </View>
        </View>
        <Text style={styles.distanceText}>{distance}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {currency} {price}
            <Text style={styles.nightText}> night</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListingCard;
