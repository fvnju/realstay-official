import { Sheet, useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import * as ExpoImagePicker from "expo-image-picker";
import {
  Camera,
  Image as ImageIcon,
  Plus,
  Star,
  Trash,
  X,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageData } from "../types";

const GRID_SPACING = 12;
const GRID_COLUMNS = 2;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 10;
const MIN_IMAGES = 1;

interface ImagePickerProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onChange,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const IMAGE_SIZE =
    (screenWidth - 70 - GRID_SPACING * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const sheetRef = useSheetRef();

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ExpoImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "We need camera and photo library permissions to add images.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const generateImageId = () =>
    `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateImage = (
    result: ExpoImagePicker.ImagePickerResult
  ): boolean => {
    if (result.canceled || !result.assets?.[0]) return false;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
      Alert.alert(
        "File Too Large",
        "Please select an image smaller than 10MB.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const addImage = (result: ExpoImagePicker.ImagePickerResult) => {
    if (!validateImage(result)) return;

    const asset = result.assets![0];
    const newImage: ImageData = {
      id: generateImageId(),
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileSize: asset.fileSize,
      fileName: asset.fileName || `image_${Date.now()}.jpg`,
    };

    onChange([...images, newImage]);
  };

  const addMultipleImages = (result: ExpoImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets) return;

    const newImages: ImageData[] = [];
    const remainingSlots = MAX_IMAGES - images.length;

    // Process up to the remaining slots or all selected images, whichever is smaller
    const assetsToProcess = result.assets.slice(0, remainingSlots);

    for (const asset of assetsToProcess) {
      // Validate each image
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
        Alert.alert(
          "File Too Large",
          `Image "${
            asset.fileName || "Unknown"
          }" is larger than 10MB and will be skipped.`,
          [{ text: "OK" }]
        );
        continue;
      }

      const newImage: ImageData = {
        id: generateImageId(),
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
      };

      newImages.push(newImage);
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    // Show info if some images were skipped due to limit
    if (result.assets.length > remainingSlots) {
      Alert.alert(
        "Selection Limit",
        `Only ${remainingSlots} images were added. You can have a maximum of ${MAX_IMAGES} images.`,
        [{ text: "OK" }]
      );
    }
  };

  const pickFromLibrary = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.close();

    if (!(await requestPermissions())) return;

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - images.length, // Limit based on remaining slots
    });

    addMultipleImages(result);
  }, [images.length]);

  const pickFromCamera = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.close();

    // Check if we've reached the maximum number of images
    if (images.length >= MAX_IMAGES) {
      Alert.alert(
        "Maximum Images Reached",
        `You can only add up to ${MAX_IMAGES} images.`,
        [{ text: "OK" }]
      );
      return;
    }

    if (!(await requestPermissions())) return;

    const result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    addImage(result);
  }, [images.length]);

  const removeImage = (imageId: string) => {
    onChange(images.filter((img) => img.id !== imageId));
  };

  const moveImageToFirst = (imageId: string) => {
    const imageIndex = images.findIndex((img) => img.id === imageId);
    if (imageIndex === -1 || imageIndex === 0) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(imageIndex, 1);
    newImages.unshift(movedImage);
    onChange(newImages);
  };

  const renderImageItem = ({ item }: { item: ImageData }) => {
    const isPrimary = images[0]?.id === item.id;

    return (
      <View style={{ marginBottom: GRID_SPACING }}>
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: theme.colors.appSurface,
              borderColor: isPrimary
                ? theme.colors.appPrimary
                : theme.colors.elementsTextFieldBorder,
              borderWidth: isPrimary ? 3 : 1,
              width: IMAGE_SIZE,
              height: IMAGE_SIZE * 0.75, // 4:3 aspect ratio (more natural for property photos)
            },
          ]}
        >
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode="cover"
          />

          {isPrimary && (
            <View
              style={[
                styles.primaryBadge,
                { backgroundColor: theme.colors.appPrimary },
              ]}
            >
              <Star color="#fff" size={12} weight="fill" />
            </View>
          )}

          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              ]}
              onPress={() => removeImage(item.id)}
            >
              <Trash color="#fff" size={14} weight="bold" />
            </TouchableOpacity>

            {!isPrimary && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.appPrimary },
                ]}
                onPress={() => moveImageToFirst(item.id)}
              >
                <Star color="#fff" size={14} weight="bold" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderAddButton = () => (
    <TouchableOpacity
      style={[
        styles.addButton,
        {
          backgroundColor: theme.colors.appSurface,
          borderColor: theme.colors.elementsTextFieldBorder,
          width: IMAGE_SIZE,
          height: IMAGE_SIZE * 0.75, // Match the image aspect ratio
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        sheetRef.current?.present();
      }}
      disabled={images.length >= MAX_IMAGES}
    >
      <Plus
        color={
          images.length >= MAX_IMAGES
            ? theme.colors.appTextSecondary
            : theme.colors.appPrimary
        }
        size={24}
        weight="bold"
      />
      <Text
        style={[
          styles.addButtonText,
          {
            color:
              images.length >= MAX_IMAGES
                ? theme.colors.appTextSecondary
                : theme.colors.appTextPrimary,
          },
          theme.fontStyles.medium,
        ]}
      >
        Add Photo
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.imageCount,
            { color: theme.colors.appTextSecondary },
            theme.fontStyles.medium,
          ]}
        >
          {images.length}/{MAX_IMAGES} photos
          {images.length < MIN_IMAGES && (
            <Text style={{ color: theme.colors.status?.error || "#EF4444" }}>
              {" "}
              (minimum {MIN_IMAGES} required)
            </Text>
          )}
        </Text>
      </View>

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        numColumns={GRID_COLUMNS}
        ListHeaderComponent={
          images.length < MAX_IMAGES ? renderAddButton : null
        }
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
      />

      {/* Action Sheet */}
      <Sheet
        bottomInset={bottom}
        ref={sheetRef}
        handleComponent={() => null}
        $modal
      >
        <ActionSheetContent
          onCamera={pickFromCamera}
          onLibrary={pickFromLibrary}
          onClose={() => sheetRef.current?.close()}
        />
      </Sheet>
    </View>
  );
};

function ActionSheetContent({
  onCamera,
  onLibrary,
  onClose,
}: {
  onCamera: () => void;
  onLibrary: () => void;
  onClose: () => void;
}) {
  const theme = useTheme();

  return (
    <BottomSheetView
      style={[
        styles.sheetContent,
        {
          backgroundColor: theme.colors.appSurface,
        },
      ]}
    >
      <View style={styles.sheetHeader}>
        <Text
          style={[
            styles.sheetTitle,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.bold,
          ]}
        >
          Add Photo
        </Text>
        <TouchableOpacity
          style={[
            styles.sheetCloseButton,
            { backgroundColor: theme.colors.elementsTextFieldBorder },
          ]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X color={theme.colors.appTextPrimary} size={18} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={styles.sheetActions}>
        <TouchableOpacity
          style={[
            styles.sheetActionOption,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
          onPress={onCamera}
          activeOpacity={0.7}
        >
          <Camera color={theme.colors.appPrimary} size={24} weight="bold" />
          <Text
            style={[
              styles.sheetActionText,
              { color: theme.colors.appTextPrimary },
              theme.fontStyles.semiBold,
            ]}
          >
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sheetActionOption,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
          onPress={onLibrary}
          activeOpacity={0.7}
        >
          <ImageIcon color={theme.colors.appPrimary} size={24} weight="bold" />
          <Text
            style={[
              styles.sheetActionText,
              { color: theme.colors.appTextPrimary },
              theme.fontStyles.semiBold,
            ]}
          >
            Choose from Library
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  imageCount: {
    fontSize: 14,
  },

  grid: {
    gap: GRID_SPACING,
  },
  addButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: GRID_SPACING,
  },
  addButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  primaryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageActions: {
    position: "absolute",
    top: 8,
    right: 8,
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
  },
  sheetCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActions: {
    gap: 12,
  },
  sheetActionOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 16,
  },
  sheetActionText: {
    fontSize: 16,
  },
});
