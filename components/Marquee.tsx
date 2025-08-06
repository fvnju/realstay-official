import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { forwardRef } from "react";
import { Dimensions, Platform, View, ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  type SharedValue,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

const images = Array.from({ length: 5 });

const { width } = Dimensions.get("window");
const _itemWidth = 0.62 * width;
const _itemHeight = (_itemWidth * 9) / 16;
const _spacing = 8 * 2;
const _itemSize = _itemWidth + _spacing;

function Item({
  index,
  offset,
}: {
  index: number;
  offset: SharedValue<number>;
}) {
  const style = {
    borderRadius: 24,
    width: _itemWidth,
    height: _itemHeight,
  } as const;

  const _styles = useAnimatedStyle(() => {
    const itemPosition = index * _itemSize - width - _itemSize / 2;
    const totalSize = images.length * _itemSize;

    const range =
      ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
      width +
      _itemSize / 2;

    return {
      transform: [
        {
          rotate: `${interpolate(range, [-_itemSize, (width - _itemSize) / 2, width], [-5, 0, 5])}deg`,
        },
      ],
    };
  });
  return (
    <Animated.View style={[style, _styles]}>
      <Image
        source={`house${index + 1}`}
        style={{ flex: 1, borderRadius: style.borderRadius }}
      />
    </Animated.View>
  );
}

export function ShowcaseView() {
  const offset = useSharedValue(0);

  useAnimatedReaction(
    () => {
      const floatIndex =
        ((offset.value + width / 2) / _itemSize) % images.length;
      return Math.abs(Math.floor(floatIndex));
    },
    (value) => {
      //console.log(value);
    },
  );

  return (
    <GestureHandlerRootView>
      <Marquee spacing={_spacing} frameRate={120} speed={0.6} position={offset}>
        <View
          style={{
            flexDirection: "row",
            gap: _spacing,
          }}
        >
          {images.map((val, index) => (
            <Item
              offset={offset}
              key={`img-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              index={index}
            />
          ))}
        </View>
      </Marquee>
    </GestureHandlerRootView>
  );
}
