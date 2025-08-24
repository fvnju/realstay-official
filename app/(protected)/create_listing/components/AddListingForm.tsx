import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { listenKeys } from "nanostores";
import { ArrowRight, Images, MapPin, MapTrifold } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { $listingSubmision } from "..";
import { FORM_LABELS, NigerianState } from "../constants";
import { useListingForm } from "../hooks/useListingForm";
import { ListingFormData } from "../types";
import { ImagePicker } from "./ImagePicker";
import { LGADropdown } from "./LGADropdown";
import { StateDropdown } from "./StateDropdown";

export const AddListingForm: React.FC = () => {
  const theme = useTheme();

  // Use Jotai form state
  const { state, lga, photos, setState, setLga, setPhotos } = useListingForm();

  // Animation values for staggered entrance
  const addressOpacity = useSharedValue(0);
  const stateOpacity = useSharedValue(0);
  const lgaOpacity = useSharedValue(0);
  const locationOpacity = useSharedValue(0);
  const photosOpacity = useSharedValue(0);
  const propertyOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const addressSlide = useSharedValue(30);
  const stateSlide = useSharedValue(30);
  const lgaSlide = useSharedValue(30);
  const locationSlide = useSharedValue(30);
  const photosSlide = useSharedValue(30);
  const propertySlide = useSharedValue(30);
  const buttonSlide = useSharedValue(30);

  // Animated styles
  const addressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addressOpacity.value,
    transform: [{ translateY: addressSlide.value }],
  }));

  const stateAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stateOpacity.value,
    transform: [{ translateY: stateSlide.value }],
  }));

  const lgaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: lgaOpacity.value,
    transform: [{ translateY: lgaSlide.value }],
  }));

  const locationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: locationOpacity.value,
    transform: [{ translateY: locationSlide.value }],
  }));

  const photosAnimatedStyle = useAnimatedStyle(() => ({
    opacity: photosOpacity.value,
    transform: [{ translateY: photosSlide.value }],
  }));

  const propertyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: propertyOpacity.value,
    transform: [{ translateY: propertySlide.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonSlide.value }],
  }));

  // Staggered entrance animations
  useEffect(() => {
    const animateSection = (opacity: any, slide: any, delay: number) => {
      opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
      slide.value = withDelay(
        delay,
        withSpring(0, { damping: 15, stiffness: 150 })
      );
    };

    animateSection(addressOpacity, addressSlide, 0);
    animateSection(stateOpacity, stateSlide, 100);
    animateSection(lgaOpacity, lgaSlide, 200);
    animateSection(locationOpacity, locationSlide, 300);
    animateSection(photosOpacity, photosSlide, 400);
    animateSection(propertyOpacity, propertySlide, 500);
    animateSection(buttonOpacity, buttonSlide, 600);
  }, []);

  const handleOpenMaps = () => {
    router.push("/MapFullView");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.formSection}
      >
        {/* Enhanced Address Section */}
        <Animated.View style={[styles.enhancedSection, addressAnimatedStyle]}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.appSurface,
                shadowColor: theme.colors.appDropShadow,
                borderColor: theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appPrimary + "20" },
                ]}
              >
                <MapPin
                  color={theme.colors.appPrimary}
                  size={20}
                  weight="bold"
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  {FORM_LABELS.address}
                </Text>
                <Text
                  style={[
                    styles.sectionHint,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  {FORM_LABELS.addressHint}
                </Text>
              </View>
            </View>
            <TextField
              autoComplete="address-line1"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              defaultValue={$listingSubmision.get().address}
              onChangeText={(t) => {
                $listingSubmision.setKey("address", t);
              }}
              placeholder="Enter property address..."
            />
          </View>
        </Animated.View>

        {/* Enhanced State Section */}
        <Animated.View style={[styles.enhancedSection, stateAnimatedStyle]}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.appSurface,
                shadowColor: theme.colors.appDropShadow,
                borderColor: theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.status.warning + "20" },
                ]}
              >
                <MapTrifold
                  color={theme.colors.status.warning}
                  size={20}
                  weight="bold"
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  {FORM_LABELS.state}
                </Text>
                <Text
                  style={[
                    styles.sectionHint,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  {FORM_LABELS.stateHint}
                </Text>
              </View>
            </View>
            <StateDropdown
              value={$listingSubmision.get().state}
              onChange={(value) => $listingSubmision.setKey("state", value)}
            />
          </View>
        </Animated.View>

        {/* Enhanced LGA Section */}
        <Animated.View style={[styles.enhancedSection, lgaAnimatedStyle]}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.appSurface,
                shadowColor: theme.colors.appDropShadow,
                borderColor: theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.status.warning + "20" },
                ]}
              >
                <MapTrifold
                  color={theme.colors.status.warning}
                  size={20}
                  weight="bold"
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  {FORM_LABELS.lga}
                </Text>
                <Text
                  style={[
                    styles.sectionHint,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  {FORM_LABELS.lgaHint}
                </Text>
              </View>
            </View>
            <LGASelector />
          </View>
        </Animated.View>

        {/* Enhanced Location Section */}
        <Animated.View style={[styles.enhancedSection, locationAnimatedStyle]}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.appSurface,
                shadowColor: theme.colors.appDropShadow,
                borderColor: theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.status.info + "20" },
                ]}
              >
                <MapPin
                  color={theme.colors.status.info}
                  size={20}
                  weight="bold"
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  {FORM_LABELS.location}
                </Text>
                <Text
                  style={[
                    styles.sectionHint,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  Set precise location on map
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderColor: theme.colors.elementsTextFieldBorder,
                },
              ]}
              onPress={handleOpenMaps}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: theme.colors.appTextPrimary },
                  theme.fontStyles.medium,
                ]}
              >
                Open Maps
              </Text>
              <ArrowRight color={theme.colors.appTextSecondary} size={16} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Enhanced Photos Section */}
        <Animated.View style={[styles.enhancedSection, photosAnimatedStyle]}>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.colors.appSurface,
                shadowColor: theme.colors.appDropShadow,
                borderColor: theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.status.success + "20" },
                ]}
              >
                <Images
                  color={theme.colors.status.success}
                  size={20}
                  weight="bold"
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  {FORM_LABELS.photos}
                </Text>
                <Text
                  style={[
                    styles.sectionHint,
                    { color: theme.colors.appTextSecondary },
                  ]}
                >
                  Add photos to showcase your property (1-10 images)
                </Text>
              </View>
            </View>
            <ImagePickerWithState />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

function LGASelector() {
  const [state, setState] = useState("");

  listenKeys($listingSubmision, ["state"], (value, oldValue, changed) => {
    setState(value.state);
  });

  return (
    <LGADropdown
      value={$listingSubmision.get().lga}
      onChange={(value) => $listingSubmision.setKey("lga", value)}
      selectedState={state as NigerianState}
    />
  );
}

function ImagePickerWithState() {
  const [state, setState] = useState<ListingFormData["photos"]>(
    $listingSubmision.get().photos
  );

  useEffect(() => {
    $listingSubmision.setKey("photos", state);
  }, [state]);

  return <ImagePicker images={state} onChange={setState} />;
}

const styles = {
  container: {
    flex: 1,
  },
  formSection: {
    gap: 24,
  },

  // Enhanced Section Styles
  enhancedSection: {
    marginBottom: 24,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },

  // Action Button Styles
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
  },

  // Footer Styles
  footer: {
    paddingTop: 24,
  },
  nextButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
