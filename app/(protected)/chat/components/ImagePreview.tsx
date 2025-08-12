import ProgressCircle from "@/components/ProgressCircle";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { X } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SharedValue } from "react-native-reanimated";

interface ImagePreviewProps {
  image: ImagePicker.ImagePickerAsset | null;
  uploadProgress: SharedValue<number>;
  onRemove: () => void;
}

export function ImagePreview({
  image,
  uploadProgress,
  onRemove,
}: ImagePreviewProps) {
  const theme = useTheme();

  if (!image) return null;

  return (
    <View
      style={{
        marginLeft: 8,
        flexDirection: "row",
        position: "relative",
        width: 120,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.appSurface,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: image.uri }}
        style={{
          height: 120,
          width: (120 * image.width) / image.height,
          opacity: 0.5,
        }}
      />

      <TouchableOpacity
        onPress={onRemove}
        style={{
          position: "absolute",
          right: 4,
          top: 4,
          zIndex: 9,
          width: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.appDropShadow,
          borderRadius: 999,
        }}
      >
        <X size={16} weight="bold" color={theme.colors.appTextPrimary} />
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProgressCircle progress={uploadProgress} radius={12} />
      </View>
    </View>
  );
}
