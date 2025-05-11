import { StyleSheet } from "react-native";

const margins = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
} as const;

const fontSizes = {
  display: 48,
  xl_4: 34,
  xl_3: 28,
  xl_2: 24,
  xl: 20,
  lg: 18,
  base: 16,
  sm: 14,
  xs: 12,
  xxs: 11,
} as const;

const fontFamily = "Figtree";

const fontStyles = StyleSheet.create({
  bold: {
    fontFamily,
    fontWeight: 700,
  },
  semiBold: {
    fontFamily,
    fontWeight: 600,
  },
  medium: {
    fontFamily,
    fontWeight: 500,
  },
  regular: {
    fontFamily,
    fontWeight: 400,
  },
});

const letterSpacing = {
  tight: -2 / 100,
  bitTight: -1 / 100,
  none: 0,
  bitLoose: 0.5 / 100,
  loose: 1 / 100,
} as const;

export const lightTheme = {
  color: {
    imageShade: "#ffffff80",
    appAccent: "#ff9800",
    appBackground: "#f9f9fb",
    appDropShadow: "#0000001a",
    appImageShade: "#ffffff80",
    appPrimary: "#0078ff",
    appSecondary: "#000000",
    appSurface: "#ffffff",
    appTextAccent: "#005dc6",
    appTextDanger: "#d00416",
    appTextPrimary: "#1c1c1e",
    appTextSecondary: "#6e6e73",
    elementsButtonBackground: "#0078ff",
    elementsButtonBackgroundSecondary: "#ff9800",
    elementsButtonDisabled: "#c7c7cc",
    elementsButtonDisabledText: "#f8f8fd",
    elementsButtonHover: "#005bbb",
    elementsButtonText: "#ffffff",
    elementsLabelText: "#1c1c1e",
    elementsOnlineIndicatorOnline: "#1fc16b",
    elementsSliderHover: "#005bbb",
    elementsSliderThumb: "#0078ff",
    elementsSliderTrack: "#d1d1d6",
    elementsTabBarIconActive: "#0078ff",
    elementsTabBarIconNormal: "#6e6e73",
    elementsTagsBackground: "#e0e0e5",
    elementsTagsText: "#0078ff",
    elementsTextFieldBackground: "#ffffff",
    elementsTextFieldBorder: "#e5e5ea",
    elementsTextFieldFocus: "#0078ff",
    elementLightTheme: "#0000001a",
  },
  margins,
  fontSizes,
  fontStyles,
  letterSpacing,
} as const;

export const darkTheme = {
  color: {
    imageShade: "#0000001a",
    appAccent: "#ff9800",
    appBackground: "#1A1A1A",
    appDropShadow: "#00000066",
    appImageShade: "#0000001a",
    appPrimary: "#1a73e8",
    appSecondary: "#ffffff",
    appSurface: "#2C2C2E",
    appTextAccent: "#55a5ff",
    appTextDanger: "#fd828c",
    appTextPrimary: "#e5e5ea",
    appTextSecondary: "#a2a2a8",
    elementsButtonBackground: "#1a73e8",
    elementsButtonBackgroundSecondary: "#8c5400",
    elementsButtonDisabled: "#2C2C2E",
    elementsButtonDisabledText: "#4C4C4E",
    elementsButtonHover: "#005bbb",
    elementsButtonText: "#ffffff",
    elementsLabelText: "#e5e5ea",
    elementsOnlineIndicatorOnline: "#84ebb4",
    elementsSliderHover: "#005bbb",
    elementsSliderThumb: "#1a73e8",
    elementsSliderTrack: "#3a3a3c",
    elementsTabBarIconActive: "#1a73e8",
    elementsTabBarIconNormal: "#a2a2a8",
    elementsTagsBackground: "#3a3a3c",
    elementsTagsText: "#1a73e8",
    elementsTextFieldBackground: "#2c2c2e",
    elementsTextFieldBorder: "#3a3a3c",
    elementsTextFieldFocus: "#1a73e8",
    elementLightTheme: "#ffffff",
  },
  margins,
  fontSizes,
  fontStyles,
  letterSpacing,
} as const;
