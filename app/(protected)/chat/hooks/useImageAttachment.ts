import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

export function useImageAttachment() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const uploadProgress = useSharedValue(0);

  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaStatus, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const pickImageFromLibrary = useCallback(async () => {
    try {
      if (!mediaStatus?.granted) {
        const permission = await requestMediaPermission();
        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Please grant photo library access to select images."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]);
        uploadProgress.value = withTiming(1, {
          duration: 800,
          easing: Easing.linear,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from library");
    }
  }, [mediaStatus, requestMediaPermission, uploadProgress]);

  const takePhoto = useCallback(async () => {
    try {
      if (!cameraStatus?.granted) {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Please grant camera access to take photos."
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]);
        uploadProgress.value = withTiming(1, {
          duration: 800,
          easing: Easing.linear,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  }, [cameraStatus, requestCameraPermission, uploadProgress]);

  const removeImage = useCallback(() => {
    setImage(null);
    uploadProgress.value = withTiming(0, {
      duration: 200,
      easing: Easing.linear,
    });
  }, [uploadProgress]);

  return {
    image,
    uploadProgress,
    pickImageFromLibrary,
    takePhoto,
    removeImage,
  };
}
