import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { RadioButton } from "phosphor-react-native";
import { useState } from "react";
import { FlatList, Keyboard, Pressable, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useSharedValuesFromTexts(texts: string[]) {
  return texts.map((text) => ({
    text,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sharedValue: useSharedValue(false),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stateValue: useState(false),
  }));
}

export default function CreateLising2() {
  const { top, bottom } = useSafeAreaInsets();
  const houseTypes = useSharedValuesFromTexts([
    "Bungalow",
    "Flat Apartments",
    "Self-Contain Apartment",
    "Mansion",
    "Hotel",
    "Detached House",
    "Others",
  ]);
  const theme = useTheme();

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
        }}
      >
        Exit
      </PrimaryButton>
      <Text
        style={[
          {
            marginTop: 40,
            fontSize: 38,
            lineHeight: 40,
            color: theme.color.appTextPrimary,
          },
          theme.fontStyles.bold,
        ]}
      >
        Type of house
      </Text>
      <FlatList
        ListHeaderComponent={<View style={{ height: 32 }} />}
        data={houseTypes}
        scrollEnabled
        renderItem={({ index, item }) => (
          <SelectPill
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
            router.push("/create_listing/part3");
          }}
          style={{ flex: 1 }}
        >
          Next
        </PrimaryButton>
      </View>
    </View>
  );
}

function SelectPill({
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

  return (
    <Pressable
      onPress={() => {
        for (let index = 0; index < otherSharedValues.length; index++) {
          const element = otherSharedValues[index];
          element.sharedValue.value = false;
          element.stateValue[1](false);
        }
        selected.value = !selected.value;
        setIsSelected(!isSelected);
      }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            maxHeight: 64,
            borderWidth: 3,
            gap: 12,
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderRadius: 24,
            alignItems: "center",
            marginBottom: 32,
          },
          animatedStyles,
        ]}
      >
        <RadioButton
          color={theme.color.appPrimary}
          size={32}
          weight={isSelected ? "fill" : "regular"}
        />
        <Text
          style={[
            { fontSize: 18, color: theme.color.appTextPrimary },
            theme.fontStyles.medium,
          ]}
        >
          {text}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
