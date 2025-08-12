import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { House as Home } from "phosphor-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddListingForm } from "./components/AddListingForm";

export default function CreateListing() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(-30);
  const contentOpacity = useSharedValue(0);
  const contentSlide = useSharedValue(50);
  const titleScale = useSharedValue(0.9);

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
      <Stack.Screen
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />

      {/* Enhanced Title Section */}
      <Animated.View style={[styles.titleSection, titleAnimatedStyle]}>
        <View
          style={[
            styles.titleIconContainer,
            { backgroundColor: theme.colors.appPrimary + "20" },
          ]}
        >
          <Home color={theme.colors.appPrimary} size={32} weight="bold" />
        </View>
        <Text
          style={[
            styles.title,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.bold,
          ]}
        >
          Create Your Listing
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.appTextSecondary }]}
        >
          Let's start with the basic details of your property
        </Text>
      </Animated.View>

      {/* Enhanced Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AddListingForm />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "25%", // 1 of 4 steps
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  headerRight: {
    width: 40, // Balance the layout
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
    paddingBottom: 40,
  },
});
