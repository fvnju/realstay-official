import { useTheme } from "@/hooks/useTheme";
import { CaretLeft, DotsThreeVertical } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  userName: string;
  userType: string;
  onBack: () => void;
  paddingTop: number;
}

export function ChatHeader({
  userName,
  userType,
  onBack,
  paddingTop,
}: ChatHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingTop,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.elementsTextFieldBorder,
        paddingBottom: 12,
        backgroundColor: theme.colors.appBackground,
      }}
    >
      <TouchableOpacity
        onPress={onBack}
        style={{
          width: 48,
          height: 48,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <CaretLeft weight="bold" color={theme.colors.appTextPrimary} />
      </TouchableOpacity>

      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            ...theme.fontStyles.bold,
            fontSize: theme.fontSizes.h4,
            color: theme.colors.appTextPrimary,
          }}
        >
          {userName}
        </Text>
        <Text
          style={{
            ...theme.fontStyles.regular,
            fontSize: theme.fontSizes.sm,
            color: theme.colors.appTextPrimary,
          }}
        >
          {`(${userType})`}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        <DotsThreeVertical weight="bold" color={theme.colors.appTextPrimary} />
      </TouchableOpacity>
    </View>
  );
}
