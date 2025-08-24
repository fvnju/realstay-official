import Listing from "@/components/Listing";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { CheckCircle, Eye, Sparkle } from "phosphor-react-native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { $listingSubmision } from ".";

export default function PublishPage() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const listingData = $listingSubmision.get();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(-30);
  const contentOpacity = useSharedValue(0);
  const contentSlide = useSharedValue(50);
  const titleScale = useSharedValue(0.9);
  const previewOpacity = useSharedValue(0);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerSlide.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentSlide.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const previewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: previewOpacity.value,
  }));

  // Entrance animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerSlide.value = withSpring(0, { damping: 15, stiffness: 150 });
    titleScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    contentSlide.value = withDelay(
      300,
      withSpring(0, { damping: 15, stiffness: 150 })
    );
    previewOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: theme.colors.appBackground,
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Enhanced Title Section */}
      <Animated.View style={[styles.titleSection, titleAnimatedStyle]}>
        <View
          style={[
            styles.titleIconContainer,
            { backgroundColor: theme.colors.appPrimary + "20" },
          ]}
        >
          <Sparkle color={theme.colors.appPrimary} size={32} weight="bold" />
        </View>
        <Text
          style={[
            styles.title,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.bold,
          ]}
        >
          Ready to Publish
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.appTextSecondary }]}
        >
          Review your listing preview and publish when ready
        </Text>
      </Animated.View>

      {/* Enhanced Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Section */}
          <Animated.View style={[styles.previewSection, previewAnimatedStyle]}>
            <View style={styles.previewHeader}>
              <View style={styles.previewTitleContainer}>
                <Eye color={theme.colors.appPrimary} size={24} weight="bold" />
                <Text
                  style={[
                    styles.previewTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  Listing Preview
                </Text>
              </View>
              {/* <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor: theme.colors.surfaceSecondary,
                    borderColor: theme.colors.elementsTextFieldBorder,
                  },
                ]}
              >
                <Edit
                  color={theme.colors.appTextSecondary}
                  size={16}
                  weight="bold"
                />
                <Text
                  style={[
                    styles.editButtonText,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  Edit
                </Text>
              </TouchableOpacity> */}
            </View>

            <View
              style={[
                styles.previewContainer,
                {
                  backgroundColor: theme.colors.appBackground,
                  borderColor: theme.colors.elementsTextFieldBorder,
                  shadowColor: theme.colors.appDropShadow,
                },
              ]}
            >
              <Listing
                title={listingData.title}
                propertyType={listingData.propertyType}
                address={listingData.address}
                state={listingData.state}
                bedrooms={listingData.bedrooms}
                bathrooms={listingData.bathrooms}
                beds={listingData.beds}
                price={listingData.price}
                paymentCycle={listingData.paymentCycle}
                description={listingData.description}
                amenities={listingData.amenities}
                photos={listingData.photos}
                showActions={false}
                showBottomBar={false}
              />
              <View style={styles.previewOverlay} />
            </View>
          </Animated.View>

          {/* Action Items */}
          <Animated.View style={[styles.actionSection, previewAnimatedStyle]}>
            <Text
              style={[
                styles.actionTitle,
                { color: theme.colors.appTextPrimary },
                theme.fontStyles.semiBold,
              ]}
            >
              Before you publish
            </Text>

            <View style={styles.actionItems}>
              {[
                "Double-check all property details",
                "Ensure photos are high quality",
                "Verify amenities are accurate",
                "Set competitive pricing",
              ].map((item, index) => (
                <View key={index} style={styles.actionItem}>
                  <CheckCircle
                    color={theme.colors.status.success}
                    size={20}
                    weight="fill"
                  />
                  <Text
                    style={[
                      styles.actionItemText,
                      { color: theme.colors.appTextSecondary },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Title Section Styles
  titleSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  titleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.8,
  },

  // Content Styles
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Preview Section Styles
  previewSection: {
    marginBottom: 32,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  previewTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewTitle: {
    fontSize: 18,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  previewContainer: {
    paddingTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },

  // Action Section Styles
  actionSection: {
    marginBottom: 24,
  },
  actionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionItems: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionItemText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
});
