import OAuthButtons from "@/components/Button/OAuthButtons";
import { PrimaryButton } from "@/components/Button/Primary";
import { ShowcaseView } from "@/components/Marquee";
import { Sheet, useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { MenuComponentRef } from "@react-native-menu/menu";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { HandWaving } from "phosphor-react-native";
import React, { useRef } from "react";
import {
  Dimensions,
  Platform,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const _itemWidth = 0.62 * width;
const _itemHeight = (_itemWidth * 9) / 16;

export default function Home() {
  const menuRef = useRef<MenuComponentRef>(null);
  const theme = useTheme();
  const styles = styleSheet();

  const _handlePrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync("https://arc.net/privacy");
  };
  const { top, bottom } = useSafeAreaInsets();
  const sheetRef = useSheetRef();
  const toggleSheet = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    sheetRef.current?.present();
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        paddingTop: top,
        paddingBottom: bottom + 12,
      }}
    >
      <Stack.Screen options={{ title: "Onboarding" }} />

      <View style={{ height: "50%" }}>
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 8 * 8,
            height: 8 * 8,
            backgroundColor: theme.colors.appSurface,
            marginTop: 24,
            borderCurve: "circular",
            borderRadius: 16 + 2,
          }}
        >
          <Image
            source="logo"
            contentFit="contain"
            style={{ height: 8 * 8 - 16, width: 8 * 8 - 16 }}
            tintColor={theme.colors.appPrimary}
          />
        </View>

        <View style={{ flex: 1 }} />

        <ShowcaseView />
      </View>
      <View style={{ paddingHorizontal: 8 * 3, height: "50%" }}>
        <Text style={[styles.title as TextStyle, { marginTop: 16 }]}>
          Welcome to RealStay
        </Text>
        <Text style={styles.caption as TextStyle}>
          From apartments to estates, our platform is your gateway to buying,
          selling, renting, and investing in real estate
        </Text>
        <View style={{ flex: 1 }} />
        <PrimaryButton style={theme.shadows.md} onPress={toggleSheet}>
          Get Started
        </PrimaryButton>

        <TouchableOpacity
          onPress={_handlePrivacyPolicy}
          activeOpacity={0.6}
          style={{
            flexDirection: "row",
            gap: 4,
            alignSelf: "center",
            marginTop: 24,
            alignItems: "center",
          }}
        >
          {Platform.select({
            ios: (
              <SymbolView
                size={20}
                name="hand.raised.circle.fill"
                type="monochrome"
                tintColor={styles.icon.color}
              />
            ),
            android: (
              <View
                style={{
                  backgroundColor: styles.icon.color,
                  borderRadius: 999,
                  width: 20 - 1,
                  height: 20,
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <HandWaving
                  color={styles.icon.backgroundColor}
                  size={12}
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                />
              </View>
            ),
          })}
          <Text
            style={{
              fontSize: theme.fontSizes.sm,
              ...theme.fontStyles.medium,
              textDecorationLine: "underline",
              color: theme.colors.appTextSecondary,
              textAlign: "center",
              marginTop: theme.margins.sm,
            }}
          >
            Our Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <Sheet
        bottomInset={bottom}
        ref={sheetRef}
        handleComponent={() => null}
        $modal
      >
        <BottomSheetInnards
          closeFunc={() => {
            sheetRef.current?.close();
          }}
        />
      </Sheet>
    </View>
  );
}

function BottomSheetInnards({ closeFunc }: { closeFunc: () => void }) {
  const theme = useTheme();
  const { privacyText, title, ...styles } = styleSheet();

  const _handleGoogle = async () => {
    const result = await WebBrowser.openBrowserAsync("https://www.google.com");
  };
  const _handleApple = async () => {
    const result = await WebBrowser.openBrowserAsync("https://www.apple.com");
  };
  return (
    <BottomSheetView
      style={{
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
        height: 80 * 4,
        backgroundColor: theme.colors.appSurface,
        paddingBottom: 32 + 8,
      }}
    >
      <Text style={[title as TextStyle, { textAlign: "left" }]}>
        Login or Sign Up
      </Text>
      <View
        style={{
          flex: 1,
          gap: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OAuthButtons.Apple onPress={_handleApple} activeOpacity={0.6} />
        <OAuthButtons.Google onPress={_handleGoogle} activeOpacity={0.6} />
      </View>
      <Link
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          // SheetManager.hide('example-sheet');
          closeFunc();
        }}
        href={{ pathname: "/email" }}
        asChild
      >
        <PrimaryButton>Continue with email</PrimaryButton>
      </Link>
    </BottomSheetView>
  );
}

const styleSheet = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();

  return {
    privacyText: {
      fontSize: theme.fontSizes.sm,
      ...theme.fontStyles.medium,
      textDecorationLine: "underline",
      color: theme.colors.appTextSecondary,
      textAlign: "center",
      marginTop: theme.margins.sm,
    },
    title: {
      fontSize: theme.fontSizes.h1,
      lineHeight: theme.fontSizes.h1 + theme.margins.sm,
      ...theme.fontStyles.bold,
      textAlign: "center",
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.h1,
      color: theme.colors.appTextPrimary,
    },
    caption: {
      ...theme.fontStyles.regular,
      lineHeight: theme.fontSizes.base + 8,
      fontSize: theme.fontSizes.base,
      color: theme.colors.appTextSecondary,
      textAlign: "center",
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.base,
      marginTop: theme.margins.lg,
    },
    icon: {
      color: theme.colors.appPrimary,
      backgroundColor: theme.colors.appBackground,
    },
  };
};

// {Platform.select({
//   ios: <ShowcaseView />,
//   android: (
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         borderRadius: 24,
//         overflow: "hidden",
//       }}
//     >
//       <Image
//         source={"house1"}
//         style={{
//           height: _itemHeight,
//           width: _itemWidth,
//           borderRadius: 24,
//         }}
//       />
//     </View>
//   ),
// })}
