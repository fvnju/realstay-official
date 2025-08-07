import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeft, Star, User } from "phosphor-react-native";
import React, { useState } from "react";
import {
  FlatList,
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

// Mock reviews data
const getMockReviews = (): Review[] => [
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
  {
    id: "4",
    userName: "David Rodriguez",
    rating: 5,
    date: "September 2024",
    comment:
      "Exceptional experience! The apartment exceeded our expectations. Clean, comfortable, and in a great location. Paul was an excellent host.",
  },
  {
    id: "5",
    userName: "Lisa Thompson",
    rating: 4,
    date: "August 2024",
    comment:
      "Very nice apartment with all the amenities we needed. The check-in process was smooth and the host was helpful with local recommendations.",
  },
  {
    id: "6",
    userName: "James Wilson",
    rating: 5,
    date: "July 2024",
    comment:
      "Perfect for our family vacation! The space was exactly what we needed and the location couldn't be better. Would definitely stay here again.",
  },
];

// Review Item Component
const ReviewItem = ({ review, theme }: { review: Review; theme: any }) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.reviewItem}>
      <View style={componentStyles.reviewHeader}>
        <View style={componentStyles.reviewerAvatar}>
          <User size={20} color={theme.colors.text.inverse} weight="fill" />
        </View>
        <View style={componentStyles.reviewerInfo}>
          <Text style={componentStyles.reviewerName}>{review.userName}</Text>
          <View style={componentStyles.reviewMeta}>
            <View style={componentStyles.reviewRating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  weight="fill"
                  color={
                    index < review.rating
                      ? theme.colors.accent
                      : theme.colors.border
                  }
                />
              ))}
            </View>
            <Text style={componentStyles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={componentStyles.reviewComment}>{review.comment}</Text>
    </View>
  );
};

export default function ReviewsScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { listingId } = useLocalSearchParams();

  const [reviews] = useState<Review[]>(getMockReviews());
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderReview = ({ item }: { item: Review }) => (
    <ReviewItem review={item} theme={theme} />
  );

  const keyExtractor = (item: Review) => item.id;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={componentStyles.header}>
        <TouchableOpacity
          style={componentStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <CaretLeft
            size={24}
            color={theme.colors.text.primary}
            weight="bold"
          />
        </TouchableOpacity>

        <View style={componentStyles.headerContent}>
          <Text style={componentStyles.headerTitle}>Reviews</Text>
          <View style={componentStyles.headerRating}>
            <Star size={16} weight="fill" color={theme.colors.accent} />
            <Text style={componentStyles.headerRatingText}>
              {averageRating.toFixed(2)} · {reviews.length} reviews
            </Text>
          </View>
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={keyExtractor}
        contentContainerStyle={componentStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={componentStyles.separator} />
        )}
      />
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
      backgroundColor: theme.colors?.surface || "#ffffff",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    headerContent: {
      flex: 1,
      gap: 4,
    },
    headerTitle: {
      fontSize: theme.fontSizes?.h3 || 24,
      ...theme.fontStyles.bold,
      color: theme.colors?.text?.primary || "#000",
    },
    headerRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    headerRatingText: {
      fontSize: theme.fontSizes?.sm || 14,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    listContainer: {
      padding: 20,
    },
    reviewItem: {
      backgroundColor: theme.colors?.surface || "#ffffff",
      padding: 20,
      borderRadius: theme.borderRadius?.lg || 12,
      gap: 16,
      ...(theme.shadows?.sm || {}),
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reviewerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors?.primary || "#0078ff",
      alignItems: "center",
      justifyContent: "center",
    },
    reviewerInfo: {
      flex: 1,
      gap: 6,
    },
    reviewerName: {
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
      color: theme.colors?.text?.primary || "#000",
    },
    reviewMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reviewRating: {
      flexDirection: "row",
      gap: 2,
    },
    reviewDate: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    reviewComment: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.regular,
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
    separator: {
      height: 16,
    },
  });
