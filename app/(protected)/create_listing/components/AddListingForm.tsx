import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, Text } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera } from "phosphor-react-native";
import { PrimaryButton } from "@/components/Button/Primary";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { FormSection } from "./FormSection";
import { PropertyTypeDropdown } from "./PropertyTypeDropdown";
import { ListingFormData } from "../types";
import {
  DEFAULT_PROPERTY_TYPE,
  DEFAULT_LOCATION,
  FORM_LABELS,
  PropertyType,
} from "../constants";
import { openMapsWithLocation } from "../utils";

export const AddListingForm: React.FC = () => {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  // Form state
  const [formData, setFormData] = useState<ListingFormData>({
    address: "",
    photos: [],
    propertyType: DEFAULT_PROPERTY_TYPE,
  });

  const updateFormData = <K extends keyof ListingFormData>(
    key: K,
    value: ListingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    // TODO: Add form validation here
    router.push("/create_listing/part2");
  };

  const handleOpenMaps = () => {
    const { latitude, longitude, label } = DEFAULT_LOCATION;
    openMapsWithLocation(latitude, longitude, label);
  };

  const handleOpenPhotos = () => {
    // TODO: Implement photo picker
    console.log("Open photo picker");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.formSection}
      >
        {/* Address Section */}
        <FormSection label={FORM_LABELS.address} hint={FORM_LABELS.addressHint}>
          <TextField
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            value={formData.address}
            onChangeText={(text) => updateFormData("address", text)}
          />
        </FormSection>

        {/* Location Section */}
        <FormSection label={FORM_LABELS.location}>
          <PrimaryButton
            style={{
              backgroundColor: theme.colors.appDropShadow,
            }}
            textStyle={{ color: theme.colors.appTextPrimary }}
            onPress={handleOpenMaps}
          >
            Open Maps
          </PrimaryButton>
        </FormSection>

        {/* Photos Section */}
        <View style={styles.formSectionWrapper}>
          <View style={styles.photoLabelSection}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.appTextPrimary },
                theme.fontStyles.semiBold,
              ]}
            >
              {FORM_LABELS.photos}
            </Text>
            <Camera size={20} color={theme.colors.appTextAccent} weight="bold" />
          </View>
          <PrimaryButton
            style={{
              backgroundColor: theme.colors.appDropShadow,
            }}
            textStyle={{ color: theme.colors.appTextPrimary }}
            onPress={handleOpenPhotos}
          >
            Open Photos
          </PrimaryButton>
        </View>

        {/* Property Type Section */}
        <FormSection label={FORM_LABELS.propertyType}>
          <PropertyTypeDropdown
            value={formData.propertyType}
            onChange={(value) => updateFormData("propertyType", value)}
          />
        </FormSection>
      </KeyboardAvoidingView>

      {/* Next Button */}
      <View style={[styles.footer, { paddingBottom: bottom + 24 }]}>
        <PrimaryButton onPress={handleNext}>Next</PrimaryButton>
      </View>
    </View>
  );
};

const styles = {
  container: {
    marginTop: 24,
    gap: 32,
    flex: 1,
  },
  formSection: {
    gap: 32,
  },
  formSectionWrapper: {
    gap: 8,
  },
  photoLabelSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
  },
} as const;
