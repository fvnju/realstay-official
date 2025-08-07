import { useTheme } from "@/hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotAvailableYet({
  message = "This feature is not available yet.",
}) {
  const theme = useTheme();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.appBackground },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.inner]}>
        <Text
          style={[
            theme.fontStyles.semiBold,
            styles.title,
            { color: theme.colors.appTextPrimary },
          ]}
        >
          Not Available Yet
        </Text>
        <Text
          style={[
            theme.fontStyles.regular,
            styles.message,
            { color: theme.colors.appTextSecondary },
          ]}
        >
          {message}
        </Text>
      </View>
      <TouchableOpacity
        onPress={router.back}
        style={{
          position: "absolute",
          bottom: bottom + 12,
          height: 44,
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={[
            theme.fontStyles.semiBold,
            {
              color: theme.colors.appTextPrimary,
              textDecorationLine: "underline",
            },
          ]}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inner: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#00000005",
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 260,
  },
});
