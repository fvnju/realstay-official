import React, { forwardRef, useState } from "react";
import {
  Pressable,
  type TextInputProps,
  TextInput as TextInputReal,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
// import { EyeIcon, EyeSlashIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useTheme } from "@/hooks/useTheme";
import { Eye, EyeSlash, X } from "phosphor-react-native";
import Animated, {
  FadeIn,
  interpolateColor,
  LayoutAnimationConfig,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TextInput = Animated.createAnimatedComponent(TextInputReal);

const TextField = forwardRef<
  TextInputReal,
  TextInputProps & {
    clearFunc?: () => void;
    isShadowed?: boolean;
    forPassword?: boolean;
    stateValue?: string;
  }
>((props, ref) => {
  const styles = styleSheet();
  const { text_2, textInput, activeColor } = styles;

  const isFocused = useSharedValue<0 | 1>(0);
  const [focused, setFocused] = useState(false);

  const borderColor = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        isFocused.value,
        [0, 1],
        [
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          textInput.borderColor!.toString(),
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          activeColor.borderColor!.toString(),
        ]
      ),
    };
  }, [textInput]);

  const [isHide, setIsHide] = useState(!!props.forPassword);

  const determineVisible = !props.forPassword
    ? props.stateValue && focused
    : focused;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        width: "100%",
      }}
    >
      <View style={[props.isShadowed ? styles.dropShadow : {}, { flex: 1 }]}>
        {props.editable === false ? (
          <View
            style={{
              position: "absolute",
              borderWidth: 3,
              borderColor: styles.dropShadow.shadowColor,
              width: "100%",
              height: 48 + 6,
              zIndex: 1,
              borderRadius: 16,
            }}
            accessible={false}
          />
        ) : null}
        <Animated.View
          style={[
            {
              borderWidth: 3,
              borderRadius: 16,
              flexDirection: "row",
              position: "relative",
              overflow: "hidden",
            },
            borderColor,
          ]}
        >
          <TextInput
            onChangeText={(t) => {
              props.onChangeText ? props.onChangeText(t) : null;
            }}
            ref={ref}
            onFocus={(e) => {
              isFocused.value = withTiming(1);
              setFocused(true);
              props.onFocus ? props.onFocus(e) : null;
            }}
            onBlur={(e) => {
              isFocused.value = withTiming(0);
              setFocused(false);
              props.onBlur ? props.onBlur(e) : null;
            }}
            style={[
              textInput,
              props.style,
              props.editable === false
                ? {
                    backgroundColor: styles.textInput.borderColor,
                    color: styles.text_2.color,
                  }
                : null,
            ]}
            secureTextEntry={isHide}
            placeholderTextColor={
              props.placeholderTextColor ?? `${text_2.color?.toString()}AF`
            }
            {...props}
          />
          {determineVisible ? (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutRight.duration(800)}
              style={{
                position: "absolute",
                right: 0,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                aspectRatio: 1,
                zIndex: 1,
              }}
            >
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  props.clearFunc ? props.clearFunc() : null;
                  if (props.forPassword) {
                    setIsHide((prev) => !prev);
                  }
                }}
              >
                {props.forPassword === true ? null : (
                  <X
                    color={activeColor.borderColor?.toString()}
                    weight="bold"
                    size={28}
                  />
                )}
              </Pressable>
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>
      {props.forPassword && (
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: styles.textInput.height,
            width: styles.textInput.height,
          }}
          onPress={() => {
            setIsHide((prev) => !prev);
          }}
        >
          <HideAndShow isHide={isHide} />
        </Pressable>
      )}
    </View>
  );
});

function HideAndShow({ isHide }: { isHide: boolean }) {
  const styles = styleSheet();
  const { text_2, textInput, activeColor } = styles;

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View entering={FadeIn}>
        {!isHide ? (
          <Eye
            color={activeColor.borderColor?.toString()}
            weight="bold"
            size={28}
          />
        ) : (
          <EyeSlash
            color={activeColor.borderColor?.toString()}
            weight="bold"
            size={28}
          />
        )}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

export default TextField;

const styleSheet = (): { [key: string]: ViewStyle & TextStyle } => {
  const theme = useTheme();
  return {
    text_2: {
      color: theme.colors.appTextSecondary,
    },
    textInput: {
      color: theme.colors.appTextPrimary,
      borderColor: theme.colors.elementsTextFieldBorder,
      backgroundColor: theme.colors.elementsTextFieldBackground,
      ...theme.fontStyles.regular,
      fontSize: theme.fontSizes.base,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      paddingLeft: 16,
      paddingRight: 48,
      width: "100%",
      borderRadius: 13,
    },
    activeColor: {
      borderColor: theme.colors.elementsTextFieldFocus,
    },
    dropShadow: {
      shadowColor: theme.colors.appDropShadow,
      shadowOffset: {
        height: 2,
        width: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      backgroundColor: theme.colors.elementsTextFieldBackground,
      borderRadius: 16,
    },
  };
};
