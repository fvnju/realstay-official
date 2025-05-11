import { useLocalSearchParams, useRouter } from "expo-router";

import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { ArrowLeft, MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import ListingCard from "@/components/ListingCard";
import TextField from "@/components/TextField";
import { Sheet, useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const userString = SecureStore.getItem("user_info");
  const userInfo = JSON.parse(userString!);

  return (
    <GuestApp
      usersName={`${userInfo["first_name"]} ${userInfo["last_name"]}`}
    />
  );
}

const GuestApp = ({ usersName }: { usersName: string }) => {
  const { email } = useLocalSearchParams();
  const sheetRef = useSheetRef();
  const styles = styleSheet();
  const { background, text, text_2, heading } = styles;
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  const scale = useSharedValue(1);

  const isDummy = false;

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
      style={[
        {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: top,
        },
        background,
      ]}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
          },

          styles.border,
        ]}
      >
        <View style={{ gap: 4 }}>
          <Text style={heading}>Hello</Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={styles.online} />
            <Text style={[text]}>{usersName}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", paddingTop: 20 }}>
          <Text style={[text, text_2]}>Logged in as</Text>
          <Text style={[styles.user_type, styles.semiBold]}>Guest</Text>
        </View>
      </View>

      <Animated.View
        style={[
          {
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            bottom: 20,
            left: width / 2,
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
          onPress={() => {
            sheetRef.current?.present();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 8,
            flex: 1,
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <MagnifyingGlass
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
            Search
          </Text>
        </Pressable>
      </Animated.View>

      <Sheet
        ref={sheetRef}
        onDismiss={Keyboard.dismiss}
        overDragResistanceFactor={0}
      >
        <BottomSheetView
          style={{
            height,
            paddingTop: top - 28,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  height: 48,
                  width: 48 + 24,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingLeft: 24,
                }}
                onPress={() => {
                  sheetRef.current?.dismiss();
                }}
              >
                <ArrowLeft
                  weight="bold"
                  size={28}
                  color={theme.color.appTextPrimary}
                />
              </TouchableOpacity>
              <Text
                style={{
                  ...theme.fontStyles.medium,
                  fontSize: theme.fontSizes.xl_4,
                  color: theme.color.appTextPrimary,
                  letterSpacing:
                    theme.letterSpacing.tight * theme.fontSizes.xl_4,
                }}
              >
                Where to?
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                justifyContent: "flex-end",
                paddingBottom: bottom + 32,
                paddingHorizontal: 24,
              }}
              behavior="height"
            >
              <TextField
                autoFocus
                placeholder="Tap to search..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </KeyboardAvoidingView>
          </Pressable>
        </BottomSheetView>
      </Sheet>

      <ScrollView
        style={{
          flexShrink: 0,
          marginTop: 32,
          display: "flex",
          marginBottom: 100 - bottom,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {isDummy
          ? Array.from({ length: 4 }).map((_, index) => (
              <ListingCard
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={`listitem-${index}`}
                currency="NGN"
                dateRange="12-14"
                distance="10km"
                imageUrl={`house${index + 1}`}
                location="London"
                price="5000"
                rating={4.5}
              />
            ))
          : null}
        <View style={{ height: 68 }} />
      </ScrollView>
    </View>
  );
};

const styleSheet = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();

  return {
    searchContainer: {
      backgroundColor: theme.color.appSurface,
      shadowColor: `${theme.color.appSecondary}4D`,
    },
    search: {
      fontSize: theme.fontSizes.xxs,
      ...theme.fontStyles.semiBold,
      letterSpacing: theme.letterSpacing.loose * theme.fontSizes.xxs,
      color: theme.color.appSecondary,
    },
    online: {
      backgroundColor: theme.color.elementsOnlineIndicatorOnline,
      width: 12,
      height: 12,
      borderRadius: 999,
    },
    background: {
      backgroundColor: theme.color.appBackground,
    },
    user_type: {
      fontSize: theme.fontSizes.xl_3,
      color: theme.color.appTextAccent,
    },
    text: {
      ...theme.fontStyles.regular,
      color: theme.color.appTextPrimary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm,
      letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.sm,
    },
    text_2: {
      color: theme.color.appTextSecondary,
    },
    heading: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.display,
      color: theme.color.appTextPrimary,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.display,
    },
    _email_: {
      color: theme.color.appTextAccent,
    },
    subHead: {
      color: theme.color.appTextPrimary,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.fontSizes.base + 8,
    },
    semiBold: {
      ...theme.fontStyles.semiBold,
    },
    border: {
      borderColor: theme.color.elementsTextFieldBorder,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  };
};
