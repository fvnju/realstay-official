import { appearanceAtom, useTheme } from "@/hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  CaretLeft,
  Check,
  DeviceMobile,
  Moon,
  Sun,
} from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEME_OPTIONS = [
  {
    key: "light",
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
    gradient: ["#ffffff", "#f8f9fa"],
  },
  {
    key: "dark",
    label: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
    gradient: ["#1a1a1a", "#2d2d2d"],
  },
  {
    key: "auto",
    label: "System",
    description: "Matches your device settings",
    icon: DeviceMobile,
    gradient: ["#6366f1", "#8b5cf6"],
  },
];

// Custom hook for local theme preview
function useLocalTheme(localAppearance: "auto" | "light" | "dark") {
  const systemTheme = useTheme(); // fallback for fontStyles, etc.
  // Import the actual theme objects
  const { lightTheme, darkTheme } = require("@/constants/themes");
  const colorScheme =
    localAppearance === "auto"
      ? systemTheme.colors.appBackground === "#1A1A1A"
        ? "dark"
        : "light"
      : localAppearance;
  const theme = useMemo(() => {
    if (colorScheme === "dark") return darkTheme;
    return lightTheme;
  }, [colorScheme, lightTheme, darkTheme]);
  // Merge fontStyles etc from systemTheme for consistency
  return { ...theme, fontStyles: systemTheme.fontStyles };
}

export default function AppearanceScreen() {
  const router = useRouter();
  const globalAppearance = useAtomValue(appearanceAtom);
  const setAppearance = useSetAtom(appearanceAtom);
  const [localAppearance, setLocalAppearance] = useState(globalAppearance);
  const localTheme = useLocalTheme(localAppearance);
  const { top } = useSafeAreaInsets();

  // Reanimated shared values
  const fadeValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.9);
  const slideValue = useSharedValue(50);

  // Animated styles
  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ scale: scaleValue.value }],
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  useEffect(() => {
    // Entrance animations with staggered timing
    fadeValue.value = withTiming(1, { duration: 600 });
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    slideValue.value = withTiming(0, { duration: 500 });
  }, []);

  const handleApply = () => {
    setAppearance(localAppearance);
    // Add success animation
    scaleValue.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
  };

  const handleRevert = () => {
    setLocalAppearance(globalAppearance);
    // Add revert animation
    scaleValue.value = withSequence(
      withTiming(0.98, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );
  };

  const handleThemeSelect = (themeKey: "auto" | "light" | "dark") => {
    // Update state first
    setLocalAppearance(themeKey);

    // Add selection animation to preview
    scaleValue.value = withSequence(
      withTiming(0.96, { duration: 100 }),
      withSpring(1, {
        damping: 12,
        stiffness: 250,
      })
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: localTheme.colors.appBackground, paddingTop: top },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Enhanced Header */}
      <Animated.View style={[styles.headerContainer, slideAnimatedStyle]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: localTheme.colors.appSurface },
          ]}
        >
          <CaretLeft
            color={localTheme.colors.appTextPrimary}
            weight="bold"
            size={20}
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.header,
              { color: localTheme.colors.appTextPrimary },
              localTheme.fontStyles.semiBold,
            ]}
          >
            Appearance
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: localTheme.colors.appTextSecondary },
            ]}
          >
            Choose your preferred theme
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Preview Section */}
        <Animated.View style={[styles.previewSection, scaleAnimatedStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: localTheme.colors.appTextPrimary },
              localTheme.fontStyles.semiBold,
            ]}
          >
            Preview
          </Text>

          {/* Enhanced Phone Mockup */}
          <View
            style={[
              styles.phoneMockup,
              {
                backgroundColor: localTheme.colors.appSurface,
                shadowColor: localTheme.colors.appDropShadow,
                borderColor: localTheme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            {/* Status Bar */}
            <View style={styles.statusBar}>
              <View style={styles.statusBarLeft}>
                <Text
                  style={[
                    styles.statusBarText,
                    { color: localTheme.colors.appTextPrimary },
                  ]}
                >
                  9:41
                </Text>
              </View>
              <View style={styles.statusBarRight}>
                <View
                  style={[
                    styles.batteryIcon,
                    { backgroundColor: localTheme.colors.appTextPrimary },
                  ]}
                />
              </View>
            </View>

            {/* App Header */}
            <View
              style={[
                styles.appHeader,
                { backgroundColor: localTheme.colors.appBackground },
              ]}
            >
              <Text
                style={[
                  styles.appTitle,
                  { color: localTheme.colors.appTextPrimary },
                  localTheme.fontStyles.semiBold,
                ]}
              >
                RealStay
              </Text>
            </View>

            {/* Content Area */}
            <View
              style={[
                styles.contentArea,
                { backgroundColor: localTheme.colors.appBackground },
              ]}
            >
              <View
                style={[
                  styles.searchBar,
                  {
                    backgroundColor:
                      localTheme.colors.elementsTextFieldBackground,
                  },
                ]}
              >
                <View
                  style={[
                    styles.searchIcon,
                    {
                      backgroundColor:
                        localTheme.colors.elementsTextFieldBorder,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.searchText,
                    {
                      backgroundColor:
                        localTheme.colors.elementsTextFieldBorder,
                    },
                  ]}
                />
              </View>

              <View style={styles.cardGrid}>
                {[1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.previewCard,
                      {
                        backgroundColor: localTheme.colors.appSurface,
                        shadowColor: localTheme.colors.appDropShadow,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.cardImage,
                        {
                          backgroundColor:
                            localTheme.colors.elementsTextFieldBorder,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.cardTitle,
                        {
                          backgroundColor:
                            localTheme.colors.elementsTextFieldBorder,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.cardSubtitle,
                        {
                          backgroundColor:
                            localTheme.colors.elementsTextFieldBorder,
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Theme Options */}
        <Animated.View style={[styles.themeSection, slideAnimatedStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: localTheme.colors.appTextPrimary },
              localTheme.fontStyles.semiBold,
            ]}
          >
            Choose Theme
          </Text>

          <View style={styles.themeOptionsContainer}>
            {THEME_OPTIONS.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = localAppearance === option.key;

              // Individual card animation values
              const cardScale = useSharedValue(1);
              const cardOpacity = useSharedValue(0);

              // Staggered entrance animation
              useEffect(() => {
                const delay = index * 100; // Stagger by 100ms per card

                setTimeout(() => {
                  cardOpacity.value = withTiming(1, { duration: 400 });
                  cardScale.value = withSequence(
                    withTiming(1.02, { duration: 150 }),
                    withSpring(1, { damping: 15, stiffness: 200 })
                  );
                }, delay);
              }, [index]);

              const cardAnimatedStyle = useAnimatedStyle(() => ({
                opacity: cardOpacity.value,
                transform: [{ scale: cardScale.value }],
              }));

              const handleCardPress = () => {
                // Immediate visual feedback
                cardScale.value = withSequence(
                  withTiming(0.95, { duration: 100 }),
                  withSpring(1, { damping: 15, stiffness: 300 })
                );

                handleThemeSelect(option.key as "auto" | "light" | "dark");
              };

              return (
                <Animated.View key={option.key} style={[cardAnimatedStyle]}>
                  <TouchableOpacity
                    onPress={handleCardPress}
                    style={[
                      styles.themeOptionCard,
                      {
                        backgroundColor: localTheme.colors.appSurface,
                        borderColor: isSelected
                          ? localTheme.colors.appPrimary
                          : localTheme.colors.elementsTextFieldBorder,
                        shadowColor: localTheme.colors.appDropShadow,
                      },
                      isSelected && styles.themeOptionSelected,
                    ]}
                  >
                    <View style={styles.themeOptionHeader}>
                      <View
                        style={[
                          styles.themeIconContainer,
                          {
                            backgroundColor: isSelected
                              ? localTheme.colors.appPrimary
                              : localTheme.colors.elementsTextFieldBackground,
                          },
                        ]}
                      >
                        <IconComponent
                          color={
                            isSelected
                              ? "#fff"
                              : localTheme.colors.appTextSecondary
                          }
                          size={20}
                          weight="bold"
                        />
                      </View>
                      {isSelected && (
                        <View
                          style={[
                            styles.checkIcon,
                            { backgroundColor: localTheme.colors.appPrimary },
                          ]}
                        >
                          <Check color="#fff" size={16} weight="bold" />
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.themeOptionTitle,
                        { color: localTheme.colors.appTextPrimary },
                        localTheme.fontStyles.semiBold,
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text
                      style={[
                        styles.themeOptionDescription,
                        { color: localTheme.colors.appTextSecondary },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Enhanced Bottom Actions */}
      <Animated.View
        style={[
          styles.bottomActions,
          {
            backgroundColor: localTheme.colors.appBackground,
            borderTopColor: localTheme.colors.elementsTextFieldBorder,
          },
          slideAnimatedStyle,
        ]}
      >
        <TouchableOpacity
          onPress={handleApply}
          style={[
            styles.applyButton,
            {
              backgroundColor: localTheme.colors.appPrimary,
              opacity: localAppearance === globalAppearance ? 0.5 : 1,
            },
          ]}
          disabled={localAppearance === globalAppearance}
        >
          <Text style={styles.applyButtonText}>Apply Changes</Text>
        </TouchableOpacity>

        {localAppearance !== globalAppearance && (
          <TouchableOpacity
            onPress={handleRevert}
            style={[
              styles.revertButton,
              {
                backgroundColor: localTheme.colors.appSurface,
                borderColor: localTheme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.revertButtonText,
                { color: localTheme.colors.appTextSecondary },
              ]}
            >
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Section Styles
  previewSection: {
    marginBottom: 40,
  },
  themeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  // Phone Mockup Styles
  phoneMockup: {
    width: 280,
    height: 500,
    borderRadius: 32,
    borderWidth: 1,
    alignSelf: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 44,
  },
  statusBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryIcon: {
    width: 24,
    height: 12,
    borderRadius: 2,
    opacity: 0.8,
  },
  appHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  contentArea: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  searchIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    opacity: 0.6,
  },
  searchText: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    opacity: 0.4,
  },
  cardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewCard: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    opacity: 0.6,
  },
  cardTitle: {
    width: "80%",
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
    opacity: 0.4,
  },
  cardSubtitle: {
    width: "60%",
    height: 10,
    borderRadius: 5,
    opacity: 0.3,
  },

  // Theme Options Styles
  themeOptionsContainer: {
    gap: 16,
  },
  themeOptionCard: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  themeOptionSelected: {
    borderWidth: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  themeOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  themeOptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },

  // Bottom Actions Styles
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    gap: 12,
  },
  applyButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  revertButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  revertButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
