import { useTheme } from "@/hooks/useTheme";
import { type ReactNode, forwardRef } from "react";
import {
  type StyleProp,
  Text,
  type TextStyle,
  TouchableOpacity,
  type TouchableOpacityProps,
  type View,
  type ViewStyle,
} from "react-native";

type ButtonProps = {
  children?: ReactNode | string;
  textStyle?: StyleProp<TextStyle>;
} & TouchableOpacityProps;

export const PrimaryButton = forwardRef<View, ButtonProps>(
  ({ children, textStyle, ...touchableProps }, ref) => {
    const theme = useTheme();
    const styles = {
      button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.elementsButtonBackground,
        borderRadius: 999,
        paddingVertical: 16,
        width: "100%",
        elevation: 0,
        shadowColor: "#000000",
        shadowOffset: {
          height: 2,
          width: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      buttonText: {
        color: theme.colors.elementsButtonText,
        fontSize: theme.fontSizes.base,
        ...theme.fontStyles.medium,
        letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.base,
        textAlign: "center",
      },
    };

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[styles.button as ViewStyle, touchableProps.style]}
      >
        {typeof children === "string" ? (
          <Text style={[styles.buttonText as TextStyle, textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);
