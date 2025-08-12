import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { Camera, Image as ImageIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AttachmentOption {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

interface AttachmentOptionsProps {
  visible: boolean;
  onTakePhoto: () => void;
  onPickImage: () => void;
}

export function AttachmentOptions({
  visible,
  onTakePhoto,
  onPickImage,
}: AttachmentOptionsProps) {
  const theme = useTheme();

  if (!visible) return null;

  const attachmentOptions: AttachmentOption[] = [
    {
      icon: (
        <Camera size={24} color={theme.colors.appTextPrimary} weight="bold" />
      ),
      label: "Camera",
      onPress: onTakePhoto,
    },
    {
      icon: (
        <ImageIcon
          size={24}
          color={theme.colors.appTextPrimary}
          weight="bold"
        />
      ),
      label: "Photo Library",
      onPress: onPickImage,
    },
  ];

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.appSurface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.elementsTextFieldBorder,
      }}
    >
      <View style={{ flexDirection: "row", gap: 24 }}>
        {attachmentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              option.onPress();
            }}
            style={{
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.elementsTextFieldBackground,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: theme.colors.elementsTextFieldBorder,
              }}
            >
              {option.icon}
            </View>
            <Text
              style={{
                ...theme.fontStyles.medium,
                fontSize: theme.fontSizes.sm,
                color: theme.colors.appTextSecondary,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
