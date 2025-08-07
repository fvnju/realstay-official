import { useTheme } from "@/hooks/useTheme";
import { forwardRef, ReactNode } from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

type ButtonProps = {
  children?: ReactNode | string;
} & TouchableOpacityProps;

const Button = forwardRef<View, ButtonProps>(
  ({ children, ...touchableProps }, ref) => {
    const styles = stylesheet();

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        style={[styles.button, touchableProps.style]}
      >
        {children}
      </TouchableOpacity>
    );
  }
);

const stylesheet = () => {
  const theme = useTheme();
  return {
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      paddingVertical: 16,
      width: "100%",
      borderWidth: 1,
      borderColor: theme.colors.appSecondary,
      gap: 8,
    } as ViewStyle,
    buttonText: {
      color: theme.colors.appTextPrimary,
      fontSize: theme.fontSizes.base,
      ...theme.fontStyles.medium,
      letterSpacing: theme.letterSpacing.bitTight * theme.fontSizes.base,
      textAlign: "center",
    } as TextStyle,
  };
};

const AppleIcon = (props: SvgProps) => (
  <Svg {...props} width={16} height={18} fill="none">
    <G clipPath="url(#a)">
      <Path
        fill={props.color}
        d="M7.75 3.946c.75 0 1.688-.522 2.247-1.217.506-.63.875-1.511.875-2.392 0-.12-.01-.24-.031-.337-.834.033-1.836.576-2.437 1.305-.474.554-.907 1.424-.907 2.315 0 .13.021.26.032.304.053.011.137.022.221.022ZM5.114 17.1c1.023 0 1.476-.707 2.752-.707 1.298 0 1.582.685 2.722.685 1.118 0 1.866-1.065 2.573-2.109.791-1.195 1.118-2.37 1.139-2.424-.074-.022-2.215-.924-2.215-3.457 0-2.196 1.688-3.185 1.783-3.261-1.118-1.653-2.816-1.696-3.28-1.696-1.256 0-2.279.783-2.922.783-.696 0-1.614-.74-2.7-.74C2.899 4.174.8 5.936.8 9.262c0 2.066.78 4.25 1.74 5.664.823 1.196 1.54 2.174 2.574 2.174Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.8 0h14.4v18H.8z" />
      </ClipPath>
    </Defs>
  </Svg>
);

const GoogleIcon = (props: SvgProps) => (
  <Svg {...props} width={18} height={18} fill="none">
    <Path
      fill="#4285F4"
      fillRule="evenodd"
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      clipRule="evenodd"
    />
    <Path
      fill="#34A853"
      fillRule="evenodd"
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      clipRule="evenodd"
    />
    <Path
      fill="#FBBC05"
      fillRule="evenodd"
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      clipRule="evenodd"
    />
    <Path
      fill="#EA4335"
      fillRule="evenodd"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      clipRule="evenodd"
    />
  </Svg>
);

const OAuthButtons = {
  Google: forwardRef<View, ButtonProps>(
    ({ children, ...touchableProps }, ref) => {
      const styles = stylesheet();

      return (
        <TouchableOpacity
          ref={ref}
          {...touchableProps}
          style={[styles.button, touchableProps.style]}
        >
          <GoogleIcon />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      );
    }
  ),
  Apple: forwardRef<View, ButtonProps>(
    ({ children, ...touchableProps }, ref) => {
      const styles = stylesheet();

      return (
        <TouchableOpacity
          ref={ref}
          {...touchableProps}
          style={[styles.button, touchableProps.style]}
        >
          <AppleIcon color={styles.buttonText.color} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
      );
    }
  ),
};

export default OAuthButtons;
