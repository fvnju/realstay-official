import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import {
  CarSimple,
  CookingPot,
  Drop,
  IconProps,
  TelevisionSimple,
  WifiHigh,
} from "phosphor-react-native";
import { JSX, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useSharedValuesFromTexts(
  items: { text: string; icon: JSX.Element }[]
) {
  return items.map((item) => ({
    text: item.text,
    icon: item.icon,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sharedValue: useSharedValue(false),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stateValue: useState(false),
  }));
}

export default function CreateLising3() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const iconStyle: IconProps = {
    size: 32,
    color: theme.color.appPrimary,
    weight: "bold",
  };
  const houseTypes = useSharedValuesFromTexts([
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
      text: "Water Suply",
      icon: <Drop {...iconStyle} />,
    },
  ]);

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
          Keyboard.dismiss();
          router.back();
          router.back();
          router.back();
        }}
      >
        Exit
      </PrimaryButton>
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
        Tell us what your place has to offer
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
        You can change this later after you publish this listing
      </Text>
      <FlatList
        ListHeaderComponent={<View style={{ height: 32 }} />}
        data={houseTypes}
        numColumns={2}
        scrollEnabled
        renderItem={({ index, item }) => (
          <ItemPill
            text={item.text}
            selected={item.sharedValue}
            key={item.text}
            elementIndex={index}
            otherSharedValues={houseTypes}
          />
        )}
      />
      <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
            flex: 1,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          Prev
        </PrimaryButton>
        <PrimaryButton
          onPress={() => {
            router.push("/create_listing/publish");
          }}
          style={{ flex: 1 }}
        >
          Next
        </PrimaryButton>
      </View>
    </View>
  );
}

function ItemPill({
  text,
  selected,
  otherSharedValues,
  elementIndex,
}: {
  text: string;
  selected: SharedValue<boolean>;
  otherSharedValues: ReturnType<typeof useSharedValuesFromTexts>;
  elementIndex: number;
}) {
  const theme = useTheme();
  const animatedStyles = useAnimatedStyle(() => ({
    borderColor: selected.value ? theme.color.appPrimary : "#0078FF1A",
    backgroundColor: selected.value ? "#0078FF1A" : theme.color.appSurface,
  }));
  const [isSelected, setIsSelected] =
    otherSharedValues[elementIndex].stateValue;
  const { width } = useWindowDimensions();

  return (
    <Pressable
      onPress={() => {
        selected.value = !selected.value;
        setIsSelected(!isSelected);
      }}
    >
      <Animated.View
        style={[
          {
            width: (width - 2 * 16 - 20) / 2,
            borderWidth: 3,
            gap: 12,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderRadius: 24,
            marginBottom: 32,
            marginRight: elementIndex % 2 === 0 ? 20 : 0,
          },
          animatedStyles,
        ]}
      >
        {otherSharedValues[elementIndex].icon}
        <Text
          style={[
            { fontSize: 18, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          {text}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
