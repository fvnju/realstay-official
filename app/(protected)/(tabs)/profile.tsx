import { useRouter } from "expo-router";
import {
  CaretRight,
  LockKey,
  SunHorizon,
  User,
  Wallet,
} from "phosphor-react-native";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const sheetRef = useSheetRef();
  const router = useRouter();
  const userString = SecureStore.getItem("user_info");
  const userInfo = JSON.parse(userString!);

  return (
    <View
      style={{
        paddingTop: top + 24,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <ScrollView
        style={{ height }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.xl_3,
            color: theme.color.appTextPrimary,
            letterSpacing: theme.letterSpacing.tight * theme.fontSizes.xl_3,
          }}
        >
          Profile
        </Text>
        <View
          style={{
            marginTop: 24,
            padding: 16,
            gap: 16,
            backgroundColor: theme.color.appSurface,
            borderRadius: 32,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.02,
            shadowRadius: 0.41,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/app_nonTabs/editProfile" });
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                overflow: "hidden",
                backgroundColor: "red",
              }}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{
                  ...theme.fontStyles.medium,
                  fontSize: theme.fontSizes.base,
                  lineHeight: theme.fontSizes.base + 4,
                  color: theme.color.appTextPrimary,
                }}
              >
                {`${userInfo["first_name"]} ${userInfo["last_name"]}`}
              </Text>
              <Text
                style={{
                  ...theme.fontStyles.regular,
                  fontSize: theme.fontSizes.sm,
                  lineHeight: theme.fontSizes.sm + 4,
                  color: theme.color.appTextSecondary,
                }}
              >
                Show your profile
              </Text>
            </View>

            <CaretRight
              weight="bold"
              size={24}
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: theme.color.elementsTextFieldBorder,
              width: "100%",
              borderRadius: 999,
              opacity: 0.5,
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 32 - 16,
              backgroundColor: "#0077FF1A",
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                ...theme.fontStyles.medium,
                lineHeight: 20,
                color: theme.color.appTextAccent,
              }}
            >
              Switch to host
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.xl_3,
            color: theme.color.appTextPrimary,
            letterSpacing: theme.letterSpacing.tight * theme.fontSizes.xl_3,
            marginTop: 48,
          }}
        >
          Settings
        </Text>
        <View style={{ gap: 20, marginTop: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              height: 44,
            }}
          >
            <User
              size={32}
              weight="regular"
              color={theme.color.appTextPrimary}
            />
            <Text
              style={{
                ...theme.fontStyles.medium,
                fontSize: theme.fontSizes.lg,
                lineHeight: 24,
                color: theme.color.appTextPrimary,
                flex: 1,
              }}
            >
              Personal information
            </Text>
            <CaretRight
              weight="bold"
              size={24}
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/settings/appearance");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              height: 44,
            }}
          >
            <SunHorizon
              size={32}
              weight="regular"
              color={theme.color.appTextPrimary}
            />
            <Text
              style={{
                ...theme.fontStyles.medium,
                fontSize: theme.fontSizes.lg,
                lineHeight: 24,
                color: theme.color.appTextPrimary,
                flex: 1,
              }}
            >
              Appearance
            </Text>
            <CaretRight
              weight="bold"
              size={24}
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              height: 44,
            }}
          >
            <Wallet
              size={32}
              weight="regular"
              color={theme.color.appTextPrimary}
            />
            <Text
              style={{
                ...theme.fontStyles.medium,
                fontSize: theme.fontSizes.lg,
                lineHeight: 24,
                color: theme.color.appTextPrimary,
                flex: 1,
              }}
            >
              Payments and billing
            </Text>
            <CaretRight
              weight="bold"
              size={24}
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              height: 44,
            }}
          >
            <LockKey
              size={32}
              weight="regular"
              color={theme.color.appTextPrimary}
            />
            <Text
              style={{
                ...theme.fontStyles.medium,
                fontSize: theme.fontSizes.lg,
                lineHeight: 24,
                color: theme.color.appTextPrimary,
                flex: 1,
              }}
            >
              Login and security
            </Text>
            <CaretRight
              weight="bold"
              size={24}
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ marginTop: 64, alignSelf: "flex-start", width: 200 }}
          onPress={async () => {
            await SecureStore.deleteItemAsync("user_info");
            await SecureStore.deleteItemAsync("access_token").then(() => {
              // @ts-ignore
              router.dismissTo("/email");
            });
          }}
        >
          <Text
            style={{
              color: theme.color.appTextDanger,
              ...theme.fontStyles.medium,
              textDecorationLine: "underline",
              fontSize: 18,
              lineHeight: 24,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
