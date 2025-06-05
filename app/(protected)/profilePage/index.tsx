import { useTheme } from "@/hooks/useTheme";
import { apiRequest } from "@/utils/apiClient";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { CaretLeft, WarningCircle } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfilePage() {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const userString = SecureStore.getItem("user_info");
  const userInfo = JSON.parse(userString!);
  const [userInfo_fresh, setUserInfo_fresh] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const networkData = await apiRequest(`/users/${userInfo["id"]}`, {
        requiresAuth: true,
      });
      setUserInfo_fresh(networkData.data);
      if (networkData.status === 401) {
        await SecureStore.deleteItemAsync("access_token").then(() => {
          // @ts-ignore
          router.dismissTo({ pathname: "/email" });
        });
      }
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.color.appBackground,
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity
        onPress={router.back}
        style={{
          width: 44,
          height: 44,
          // alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CaretLeft color={theme.color.appTextPrimary} weight="bold" />
      </TouchableOpacity>

      <View
        style={{
          width: "100%",
          aspectRatio: 16 / 9,
          backgroundColor: theme.color.appSurface,
          borderRadius: 32,
          marginTop: 24,
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          // iOS Shadow
          shadowColor: theme.color.appDropShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,

          // Android Shadow
          elevation: 6,
        }}
      >
        <View
          style={{
            backgroundColor: "red",
            borderRadius: 999,
            width: 8 * 11,
            aspectRatio: 1,
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            ...theme.fontStyles.bold,
            fontSize: theme.fontSizes.xl_2,
            color: theme.color.appTextPrimary,
          }}
        >{`${userInfo["first_name"]} ${userInfo["last_name"]}`}</Text>
        <Text
          style={{
            ...theme.fontStyles.medium,
            fontSize: theme.fontSizes.sm,
            color: theme.color.appTextSecondary,
          }}
        >
          {userInfo_fresh === null ? "unknown" : userInfo_fresh.user_type}
        </Text>
      </View>

      <Text
        style={{
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.base,
          color: theme.color.appTextPrimary,
          marginTop: 32,
        }}
      >
        Created on:{" "}
        <Text
          style={{
            fontWeight: 400,
            fontSize: theme.fontSizes.base,
            textDecorationLine: "underline",
          }}
        >
          {userInfo_fresh === null ? "unknown" : userInfo_fresh.createdAt}
        </Text>
      </Text>

      {/* Report Button for different user */}
      {false && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: `${theme.color.appTextDanger}2F`,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 16,
            marginTop: 32,
            alignSelf: "flex-start",
            shadowColor: theme.color.appDropShadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
          activeOpacity={0.8}
          onPress={() => {
            // TODO: Implement report logic/modal
          }}
          accessibilityRole="button"
          accessibilityLabel={`Report ${userInfo["first_name"]} ${userInfo["last_name"]}`}
        >
          <WarningCircle
            size={22}
            weight="bold"
            color={theme.color.appTextDanger}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              ...theme.fontStyles.semiBold,
              color: theme.color.appTextDanger,
              fontSize: theme.fontSizes.base,
            }}
          >
            {`Report ${userInfo["first_name"]} ${userInfo["last_name"]}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
