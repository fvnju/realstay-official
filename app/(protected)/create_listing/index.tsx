import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import React from "react";
import { Keyboard, Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddListingForm } from "./components/AddListingForm";

export default function CreateListing() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  const handleExit = () => {
    Keyboard.dismiss();
    router.back();
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          paddingTop: top + 12,
          backgroundColor: theme.colors.appBackground,
        },
      ]}
      onPress={Keyboard.dismiss}
    >
      <Stack.Screen
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />

      {/* Exit Button */}
      <PrimaryButton
        style={[
          styles.exitButton,
          { backgroundColor: theme.colors.appDropShadow },
        ]}
        textStyle={{ color: theme.colors.appTextPrimary }}
        onPress={handleExit}
      >
        Exit
      </PrimaryButton>

      {/* Page Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.appTextPrimary },
          theme.fontStyles.bold,
        ]}
      >
        Add Listing
      </Text>

      {/* Form Component */}
      <AddListingForm />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exitButton: {
    alignSelf: "flex-start",
    width: "auto",
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 40,
    fontSize: 38,
    lineHeight: 40,
  },
});
