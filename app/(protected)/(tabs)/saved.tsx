import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { BookmarkSimple, ClockCounterClockwise } from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Sheet, useSheetRef } from "@/components/sheet";
import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";

// Floating Action Button Component
const FloatingActionButton = ({
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
    transform: [{ translateX: "-50%" }, { scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [onPress]);

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
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <ClockCounterClockwise
          size={16}
          weight="bold"
          color={theme.colors.text.primary}
        />
        <Text style={componentStyles.floatingButtonText}>Recently viewed</Text>
      </Pressable>
    </Animated.View>
  );
};

// Recently Viewed Sheet Component
const RecentlyViewedSheet = ({ theme, height, ref }: any) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <Sheet ref={ref} snapPoints={[height / 2, height]}>
      <BottomSheetView style={componentStyles.sheetContent}>
        <Text style={componentStyles.sheetEmptyText}>
          There's nothing here yet.
        </Text>
        <Text style={componentStyles.sheetEmptySubtext}>
          Your recently viewed properties will appear here
        </Text>
      </BottomSheetView>
    </Sheet>
  );
};

export default function SavedScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { width, height } = useWindowDimensions();
  const sheetRef = useSheetRef();

  const handleRecentlyViewedPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return (
    <View
      style={[
        styles.container,
        componentStyles.container,
        {
          paddingTop: top + 24,
          paddingBottom: bottom,
        },
      ]}
    >
      {/* Header */}
      <View style={componentStyles.header}>
        <Text style={componentStyles.title}>
          Saved <Text style={componentStyles.titleAccent}>for later</Text>
        </Text>
      </View>

      {/* Content */}
      <View style={componentStyles.content}>
        <EmptyState theme={theme} />
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton
        theme={theme}
        width={width}
        onPress={handleRecentlyViewedPress}
      />

      {/* Recently Viewed Sheet */}
      <RecentlyViewedSheet ref={sheetRef} theme={theme} height={height} />
    </View>
  );
}

// Empty State Component
const EmptyState = ({ theme }: { theme: any }) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.emptyStateContainer}>
      {/* Stacked Images Illustration */}
      <View style={componentStyles.illustrationContainer}>
        <View style={componentStyles.imagesStack}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Image
              key={`house-${index}`}
              source="house3"
              style={[
                componentStyles.stackedImage,
                {
                  opacity: index === 0 ? 0.7 : index === 1 ? 0.9 : 1,
                  zIndex: index,
                  position: index > 0 ? "absolute" : "relative",
                  left: index === 1 ? 43 : index === 2 ? 108 : undefined,
                  top: index === 1 ? 44 : index === 2 ? 121 : undefined,
                },
              ]}
            />
          ))}

          {/* Bookmark Icon */}
          <View style={componentStyles.bookmarkIcon}>
            <BookmarkSimple
              weight="duotone"
              size={28}
              color={theme.colors.accent}
              duotoneColor={theme.colors.accent + "80"}
              duotoneOpacity={1}
            />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={componentStyles.emptyTextContainer}>
        <Text style={componentStyles.emptyTitle}>Nothing saved yet</Text>
        <Text style={componentStyles.emptySubtitle}>
          Start exploring and save properties you love for easy access later
        </Text>
      </View>
    </View>
  );
};
// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      justifyContent: "space-between",
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.h1,
      color: theme.colors.text.primary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.h1,
    },
    titleAccent: {
      fontSize: theme.fontSizes.h3,
      lineHeight: theme.fontSizes.display,
      color: theme.colors.primary,
      letterSpacing: theme.letterSpacing.none,
      opacity: 0.8,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    emptyStateContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    illustrationContainer: {
      marginBottom: theme.spacing.xl,
    },
    imagesStack: {
      width: 256,
      height: 291,
      position: "relative",
    },
    stackedImage: {
      width: 130,
      height: 170,
      borderRadius: theme.borderRadius.lg,
      borderColor: theme.colors.surface,
      borderWidth: 5,
    },
    bookmarkIcon: {
      position: "absolute",
      zIndex: 10,
      right: 0,
      top: 0,
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      ...theme.shadows.sm,
    },
    emptyTextContainer: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    emptyTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.h2,
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    emptySubtitle: {
      textAlign: "center",
      ...theme.fontStyles.regular,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      lineHeight: theme.fontSizes.base * theme.lineHeights.relaxed,
    },
    floatingButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      zIndex: 1,
      bottom: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      ...theme.shadows.md,
    },
    floatingButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      flex: 1,
    },
    floatingButtonText: {
      color: theme.colors.text.primary,
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.xs,
      letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
    },
    sheetContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    sheetEmptyText: {
      textAlign: "center",
      color: theme.colors.text.primary,
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.h1,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.h1,
      marginBottom: theme.spacing.sm,
    },
    sheetEmptySubtext: {
      textAlign: "center",
      color: theme.colors.text.secondary,
      ...theme.fontStyles.regular,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.fontSizes.base * theme.lineHeights.normal,
    },
  });
