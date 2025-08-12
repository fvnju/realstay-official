import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading chat...",
}: LoadingStateProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.appBackground,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          ...theme.fontStyles.regular,
          fontSize: theme.fontSizes.base,
          color: theme.colors.appTextSecondary,
        }}
      >
        {message}
      </Text>
    </View>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.appBackground,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
    >
      <Text
        style={{
          ...theme.fontStyles.medium,
          fontSize: theme.fontSizes.lg,
          color: theme.colors.appTextPrimary,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Failed to load chat
      </Text>
      <Text
        style={{
          ...theme.fontStyles.regular,
          fontSize: theme.fontSizes.base,
          color: theme.colors.appTextSecondary,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Please check your connection and try again
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: theme.colors.appPrimary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            ...theme.fontStyles.medium,
            fontSize: theme.fontSizes.base,
            color: "#FFFFFF",
          }}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
