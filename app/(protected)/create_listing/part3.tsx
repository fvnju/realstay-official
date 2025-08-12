import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import {
  CarSimple,
  Check,
  CookingPot,
  Drop,
  IconProps,
  Star,
  TelevisionSimple,
  WifiHigh,
} from "phosphor-react-native";
import React, { JSX, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useListingForm } from "./components";

export function useSharedValuesFromTexts(
  items: { text: string; icon: JSX.Element }[],
  formAmenities: string[]
) {
  return items.map((item) => ({
    text: item.text,
    icon: item.icon,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sharedValue: useSharedValue(formAmenities.includes(item.text)),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stateValue: useState(formAmenities.includes(item.text)),
  }));
}

export default function CreateListing3() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { amenities: formAmenities, setAmenities: setFormAmenities } =
    useListingForm();

  const iconStyle: IconProps = {
    size: 28,
    color: theme.colors.appPrimary,
    weight: "bold",
  };

  const amenities = useSharedValuesFromTexts(
    [
      {
        text: "TV",
        icon: <TelevisionSimple {...iconStyle} />,
      },
      {
        text: "Wi-Fi",
        icon: <WifiHigh {...iconStyle} />,
      },
      {
        text: "Free parking",
        icon: <CarSimple {...iconStyle} />,
      },
      {
        text: "Kitchen",
        icon: <CookingPot {...iconStyle} />,
      },
      {
        text: "Water Supply",
        icon: <Drop {...iconStyle} />,
      },
    ],
    formAmenities
  );

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(-30);
  const contentOpacity = useSharedValue(0);
  const contentSlide = useSharedValue(50);
  const titleScale = useSharedValue(0.9);
  const gridOpacity = useSharedValue(0);
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

  const gridAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
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
    gridOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
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
          <Star color={theme.colors.appPrimary} size={32} weight="bold" />
        </View>
        <Text
          style={[
            styles.title,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.bold,
          ]}
        >
          What amenities do you offer?
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.appTextSecondary }]}
        >
          Select all the amenities available at your property
        </Text>
      </Animated.View>

      {/* Enhanced Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <Animated.View style={[styles.gridContainer, gridAnimatedStyle]}>
          <FlatList
            data={amenities}
            numColumns={2}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContent}
            renderItem={({ index, item }) => (
              <ItemPill
                text={item.text}
                icon={item.icon}
                selected={item.sharedValue}
                key={item.text}
                elementIndex={index}
                otherSharedValues={amenities}
                delay={index * 100} // Staggered animation
              />
            )}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function ItemPill({
  text,
  icon,
  selected,
  otherSharedValues,
  elementIndex,
  delay = 0,
}: {
  text: string;
  icon: JSX.Element;
  selected: SharedValue<boolean>;
  otherSharedValues: ReturnType<typeof useSharedValuesFromTexts>;
  elementIndex: number;
  delay?: number;
}) {
  const { setAmenities } = useListingForm();
  const theme = useTheme();
  const { width } = useWindowDimensions();

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
    transform: [{ scale: selected.value ? 1 : 1 }],
  }));

  const [isSelected, setIsSelected] =
    otherSharedValues[elementIndex].stateValue;

  const handlePress = () => {
    // Toggle selection (multiple selection allowed for amenities)
    const newSelectedState = !isSelected;
    selected.value = newSelectedState;
    setIsSelected(newSelectedState);

    if (newSelectedState) {
      setAmenities((prev) => [...prev, text]);
    } else {
      setAmenities((prev) =>
        prev.filter((item) => {
          return item !== text;
        })
      );
    }

    // Add press animation
    itemScale.value = withTiming(0.95, { duration: 100 }, () => {
      itemScale.value = withSpring(selected.value ? 1 : 1, {
        damping: 15,
        stiffness: 200,
      });
    });
  };

  const cardWidth = (width - 40 - 16) / 2; // Account for padding and gap

  return (
    <Animated.View
      style={[
        styles.pillContainer,
        itemAnimatedStyle,
        { width: cardWidth, marginRight: elementIndex % 2 === 0 ? 16 : 0 },
      ]}
    >
      <Pressable onPress={handlePress}>
        <Animated.View style={[styles.pill, selectionAnimatedStyle]}>
          <View style={styles.pillContent}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected
                    ? theme.colors.appPrimary + "20"
                    : theme.colors.surfaceSecondary,
                },
              ]}
            >
              {React.cloneElement(icon, {
                color: isSelected
                  ? theme.colors.appPrimary
                  : theme.colors.appTextSecondary,
                size: 24,
              })}
            </View>

            <Text
              style={[
                styles.pillText,
                {
                  color: isSelected
                    ? theme.colors.appPrimary
                    : theme.colors.appTextPrimary,
                },
                theme.fontStyles.semiBold,
              ]}
            >
              {text}
            </Text>

            {isSelected && (
              <View
                style={[
                  styles.checkContainer,
                  { backgroundColor: theme.colors.appPrimary },
                ]}
              >
                <Check color="#fff" size={16} weight="bold" />
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
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
    width: "75%", // 3 of 4 steps
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
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: 20,
  },

  // Pill Styles
  pillContainer: {
    marginBottom: 16,
  },
  pill: {
    borderRadius: 16,
    borderWidth: 2,
    minHeight: 120,
  },
  pillContent: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pillText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  checkContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
