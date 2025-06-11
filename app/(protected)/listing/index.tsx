import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeft, Star } from "phosphor-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Listing() {
  const theme = useTheme();
  const { demoNumber } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const isDemo = demoNumber !== undefined ? demoNumber.length > 0 : false;
  const router = useRouter();

  return (
    <View style={{ backgroundColor: theme.color.appBackground, flex: 1 }}>
      <View
        style={{
          paddingTop: top + 12,
          flex: 1,
          backgroundColor: theme.color.appBackground,
        }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View
          style={{ position: "relative", height: 200, marginHorizontal: 16 }}
        >
          <Image
            style={{ flex: 1, borderRadius: 32 }}
            source={{ uri: isDemo ? `house${demoNumber}` : "house1" }}
            contentFit="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: theme.color.appSurface,
              width: 32,
              height: 32,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={router.back}
          >
            <CaretLeft
              size={16}
              weight="bold"
              color={theme.color.appTextPrimary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          automaticallyAdjustContentInsets
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <BlurView intensity={20}>
            <Text
              style={[
                {
                  paddingTop: 24,
                  textAlign: "center",
                  fontSize: 32,
                  color: theme.color.appTextPrimary,
                },
                theme.fontStyles.semiBold,
              ]}
            >
              Spacious 2-Bedroom Apartment for Rent
            </Text>
          </BlurView>
          <Text
            style={[
              {
                textAlign: "center",
                fontSize: 14,
                color: theme.color.appTextSecondary,
                marginTop: 24,
              },
              theme.fontStyles.medium,
            ]}
          >
            {"Apartment"} in {"Kubwa, Abuja"}
          </Text>
          <Text
            style={[
              {
                textAlign: "center",
                fontSize: 14,
                color: theme.color.appTextSecondary,
                marginTop: 2,
              },
              theme.fontStyles.medium,
            ]}
          >
            {2} guests · {2} bedrooms · {2} beds · {2} bathrooms
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
              gap: 2,
            }}
          >
            <Star size={12} weight="fill" color={theme.color.appTextPrimary} />
            <Text
              style={[
                {
                  textAlign: "center",
                  fontSize: 12,
                  color: theme.color.appTextPrimary,
                },
                theme.fontStyles.semiBold,
              ]}
            >
              4.81{"  "}·{"  "}
              {20} reviews
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 32,
              flexDirection: "row",
              gap: 16,
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                backgroundColor: "red",
                width: 8 * 6,
                aspectRatio: 1,
                borderRadius: 999,
              }}
            />
            <View>
              <Text
                style={[
                  { color: theme.color.appTextPrimary, fontSize: 16 },
                  theme.fontStyles.semiBold,
                ]}
              >
                Hosted by {"Paul Illoris"}
              </Text>
              <Text
                style={[
                  {
                    color: theme.color.appTextSecondary,
                    fontSize: 12,
                    marginTop: 2,
                    textDecorationLine: "underline",
                  },
                  theme.fontStyles.medium,
                ]}
              >
                {"5 months on this app"}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 16 }}>
            <Text
              style={[
                {
                  color: theme.color.appTextPrimary,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  lineHeight: 20,
                },
                theme.fontStyles.regular,
              ]}
              numberOfLines={8}
            >
              {
                "Welcome to your home away from home! This stylish 2-bedroom, 2-bathroom apartment offers the perfect blend of comfort and sophistication in the bustling heart of the city. Located on the 8th floor of a modern high-rise, this spacious 1,200 square-foot apartment features floor-to-ceiling windows that bathe the interior in natural light and provide sweeping views of the skyline."
              }
            </Text>
            <PrimaryButton
              style={{ backgroundColor: theme.color.appDropShadow }}
              textStyle={{
                color: theme.color.appTextPrimary,
                ...theme.fontStyles.semiBold,
                textDecorationLine: "underline",
              }}
            >
              Show more
            </PrimaryButton>
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </View>
      <View
        style={{
          paddingTop: 16,
          paddingBottom: bottom,
          backgroundColor: theme.color.appSurface,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={[
              {
                fontSize: 20,
                color: theme.color.appTextPrimary,
                textDecorationLine: "underline",
              },
              theme.fontStyles.bold,
            ]}
          >
            ₦{(50000).toLocaleString("en-US")}
          </Text>
          <Text
            style={[
              {
                fontSize: 12,
                color: theme.color.appTextSecondary,
                marginTop: 2,
              },
              theme.fontStyles.medium,
            ]}
          >
            per night
          </Text>
        </View>
        <PrimaryButton
          style={{
            width: "auto",
            alignSelf: "flex-start",
            paddingHorizontal: 24 * 2,
          }}
          onPress={() => {
            router.back();
            router.navigate({
              // @ts-expect-error typescript bs
              pathname: `/chat/${"6813b689f7369be5c71df81d"}`,
            });
          }}
        >
          Reserve
        </PrimaryButton>
      </View>
    </View>
  );
}
