import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";

interface TypingIndicatorProps {
  visible: boolean;
  userName: string;
}

export function TypingIndicator({ visible, userName }: TypingIndicatorProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.appBackground,
      }}
    >
      <Text
        style={{
          ...theme.fontStyles.regular,
          fontSize: theme.fontSizes.sm,
          color: theme.colors.appTextSecondary,
          fontStyle: "italic",
        }}
      >
        {userName} is typing...
      </Text>
    </View>
  );
}
