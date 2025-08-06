import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Listing from "../listing";

export default function PublishPage() {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top + 12,
        paddingBottom: bottom,
        paddingHorizontal: 16,
        backgroundColor: theme.color.appBackground,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <PrimaryButton
        style={{
          backgroundColor: theme.color.appDropShadow,
          alignSelf: "flex-start",
          width: "auto",
          paddingHorizontal: 24,
        }}
        textStyle={{ color: theme.color.appTextPrimary }}
        onPress={() => {
          while (router.canGoBack()) {
            router.back();
          }
        }}
      >
        Exit
      </PrimaryButton>
      <ScrollView style={{ flex: 1 }}>
        <Text
          style={[
            {
              marginTop: 40,
              fontSize: 38,
              color: theme.color.appTextPrimary,
              lineHeight: 40,
            },
            theme.fontStyles.bold,
          ]}
        >
          Now, it’s time to publish
        </Text>
        <Text
          style={[
            {
              marginTop: 20,
              fontSize: 18,
              color: theme.color.appTextSecondary,
            },
            theme.fontStyles.regular,
          ]}
        >
          Here’s what we will show your guest. Before you publish, make sure to
          review the details
        </Text>
        <View
          style={{
            position: "relative",
            opacity: 0.5,
          }}
        >
          <Listing />
          <View
            pointerEvents="auto"
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "transparent",
              zIndex: 1,
            }}
          />
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
            flex: 1,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
          onPress={() => {
            router.back();
          }}
        >
          Prev
        </PrimaryButton>
        <PrimaryButton onPress={() => {}} style={{ flex: 1 }}>
          Publish
        </PrimaryButton>
      </View>
    </View>
  );
}
