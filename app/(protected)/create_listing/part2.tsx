import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { House as Home } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { $listingSubmision } from ".";
import { PROPERTY_TYPES, PropertyType } from "./constants";

export function useSharedValuesFromTexts(
  texts: PropertyType[],
  selected?: string
) {
  return texts.map((text) => ({
    text,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sharedValue: useSharedValue(text === selected),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stateValue: useState(text === selected),
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "50%", // 2 of 4 steps
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  headerRight: {
    width: 40, // Balance the layout
  },

  // Title Section Styles
  titleSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  titleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.8,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },

  // Pill Styles
  pillContainer: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  pill: {
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  pillContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  radioContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pillText: {
    fontSize: 18,
    flex: 1,
  },

  // Navigation Styles
  navigationContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    gap: 8,
  },
  prevButtonText: {
    fontSize: 16,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default function CreateListing2() {
  const { top, bottom } = useSafeAreaInsets();
  // const { propertyType, setPropertyType } = useListingForm();
  const houseTypes = useSharedValuesFromTexts(
    PROPERTY_TYPES.map((propType) => propType.label),
    $listingSubmision.get().propertyType
  );
  const theme = useTheme();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(-30);
  const contentOpacity = useSharedValue(0);
  const contentSlide = useSharedValue(50);
  const titleScale = useSharedValue(0.9);
  const listOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerSlide.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentSlide.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  // Entrance animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerSlide.value = withSpring(0, { damping: 15, stiffness: 150 });
    titleScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    contentSlide.value = withDelay(
      300,
      withSpring(0, { damping: 15, stiffness: 150 })
    );
    listOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    buttonsOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: theme.colors.appBackground,
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Enhanced Title Section */}
      <Animated.View style={[styles.titleSection, titleAnimatedStyle]}>
        <View
          style={[
            styles.titleIconContainer,
            { backgroundColor: theme.colors.appPrimary + "20" },
          ]}
        >
          <Home color={theme.colors.appPrimary} size={32} weight="bold" />
        </View>
        <Text
          style={[
            styles.title,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.bold,
          ]}
        >
          Property Type
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.appTextSecondary }]}
        >
          Select the type of property you're listing
        </Text>
      </Animated.View>

      {/* Enhanced Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <Animated.View style={[styles.listContainer, listAnimatedStyle]}>
          <FlatList
            data={houseTypes}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ index, item }) => (
              <SelectPill
                onSelect={() => {
                  $listingSubmision.setKey("propertyType", item.text);
                }}
                text={item.text}
                selected={item.sharedValue}
                key={item.text}
                elementIndex={index}
                otherSharedValues={houseTypes}
                delay={index * 50} // Staggered animation
              />
            )}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function SelectPill({
  text,
  selected,
  otherSharedValues,
  elementIndex,
  delay = 0,
  onSelect,
}: {
  text: string;
  selected: SharedValue<boolean>;
  otherSharedValues: ReturnType<typeof useSharedValuesFromTexts>;
  elementIndex: number;
  delay?: number;
  onSelect: () => void;
}) {
  const theme = useTheme();
  const itemOpacity = useSharedValue(0);
  const itemSlide = useSharedValue(30);
  const itemScale = useSharedValue(0.95);

  // Individual item entrance animation
  useEffect(() => {
    itemOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    itemSlide.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 150 })
    );
    itemScale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  }, [delay]);

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemSlide.value }, { scale: itemScale.value }],
  }));

  const selectionAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: selected.value
      ? theme.colors.appPrimary
      : theme.colors.elementsTextFieldBorder,
    backgroundColor: selected.value
      ? theme.colors.appPrimary + "15"
      : theme.colors.appSurface,
    shadowColor: selected.value
      ? theme.colors.appPrimary
      : theme.colors.appDropShadow,
    shadowOpacity: selected.value ? 0.2 : 0.08,
  }));

  const [isSelected, setIsSelected] =
    otherSharedValues[elementIndex].stateValue;

  const handlePress = () => {
    // Deselect all others
    for (let index = 0; index < otherSharedValues.length; index++) {
      const element = otherSharedValues[index];
      element.sharedValue.value = false;
      element.stateValue[1](false);
    }

    // Select this one
    selected.value = true;
    setIsSelected(true);
    onSelect();

    // Add press animation
    itemScale.value = withTiming(0.98, { duration: 100 }, () => {
      itemScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    });
  };

  return (
    <Animated.View
      style={[styles.pillContainer, itemAnimatedStyle, selectionAnimatedStyle]}
    >
      <Pressable onPress={handlePress}>
        <View style={styles.pillContent}>
          <View
            style={[
              styles.radioContainer,
              {
                backgroundColor: isSelected
                  ? theme.colors.appPrimary
                  : theme.colors.surfaceSecondary,
                borderColor: isSelected
                  ? theme.colors.appPrimary
                  : theme.colors.elementsTextFieldBorder,
              },
            ]}
          >
            {isSelected && (
              <View style={[styles.radioInner, { backgroundColor: "#fff" }]} />
            )}
          </View>
          <Text
            style={[
              styles.pillText,
              {
                color: isSelected
                  ? theme.colors.appPrimary
                  : theme.colors.appTextPrimary,
              },
              theme.fontStyles.medium,
            ]}
          >
            {text}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
