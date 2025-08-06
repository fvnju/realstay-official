import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { BookmarkSimple, ClockCounterClockwise } from "phosphor-react-native";
import { Fragment, type ReactNode, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sheet, useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";

export default function Feed() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const sheetRef = useSheetRef();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -50 }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 12,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  return (
    <View
      style={{
        paddingTop: top + (Platform.OS === "android" ? 16 : 0),
        paddingBottom: bottom,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <Text
        style={{
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.display,
          color: theme.color.appTextPrimary,
          letterSpacing: theme.letterSpacing.tight * theme.fontSizes.display,
        }}
      >
        Saved{" "}
        <Text
          style={{
            fontSize: theme.fontSizes.xl_2,
            lineHeight: theme.fontSizes.display,
            color: theme.color.appTextAccent,
            letterSpacing: theme.letterSpacing.none,
            opacity: 0.7,
          }}
        >
          for later
        </Text>
      </Text>

      <EmptyState />

      <Animated.View
        style={[
          {
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            bottom: 20,
            left: width / 2 - 16 * 1.5,
            backgroundColor: theme.color.appSurface,
            borderRadius: 999,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1.41,
            elevation: 2,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
            paddingHorizontal: 16,
          }}
          onPress={() => {
            sheetRef.current?.present();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <ClockCounterClockwise
            size={16}
            weight="bold"
            color={theme.color.appTextPrimary}
          />
          <Text
            style={{
              color: theme.color.appTextPrimary,
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.xs,
              letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xs,
            }}
          >
            Recently viewed
          </Text>
        </Pressable>
      </Animated.View>

      <Sheet ref={sheetRef} snapPoints={[height / 2, height]}>
        <BottomSheetView
          style={{
            height: height / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: theme.color.appTextSecondary,
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.xl_4,
              letterSpacing: theme.letterSpacing.tight * theme.fontSizes.xl_4,
            }}
          >
            {"There's nothing here bro."}
          </Text>
        </BottomSheetView>
      </Sheet>
    </View>
  );
}

function EmptyState() {
  const theme = useTheme();

  return (
    <Fragment>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            width: 130 + (131 - 5),
            height: 170 + 121,
          }}
        >
          {
            Array.from({ length: 3 }).map((v, i) => (
              <Image
                key={`img${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  i
                }`}
                source={"house3"}
                style={{
                  width: 120 + 10,
                  height: 160 + 10,
                  borderRadius: 16,
                  borderColor: theme.color.appSurface,
                  borderWidth: 5,
                  opacity: i === 0 ? 0.7 : i === 1 ? 0.9 : 1,
                  zIndex: i,
                  position: i === 1 || i === 2 ? "absolute" : "relative",
                  left: i === 1 ? 48 - 5 : i === 2 ? 113 - 5 : undefined,
                  top: i === 1 ? 49 - 5 : i === 2 ? 126 - 5 : undefined,
                }}
              />
            )) as ReactNode[]
          }
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              right: 0,
              width: 48,
              height: 48,
            }}
          >
            <BookmarkSimple
              weight="duotone"
              size={32}
              color="#FF9800"
              duotoneColor="#FFBA55"
              duotoneOpacity={1}
            />
          </View>
        </View>
        <Text
          style={{
            marginTop: 24,
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.xl_3,
            color: theme.color.appTextPrimary,
            textAlign: "center",
          }}
        >
          Here's a bit empty.
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 2,
            ...theme.fontStyles.regular,
            fontSize: theme.fontSizes.base,
            color: theme.color.appTextSecondary,
            paddingHorizontal: 28,
          }}
        >
          Take your time and look for what you like.
        </Text>
      </View>

      <View />
    </Fragment>
  );
}
