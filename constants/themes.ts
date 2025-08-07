import { StyleSheet } from "react-native";

// Spacing system following 8pt grid
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Legacy margins for backward compatibility
const margins = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
} as const;

// Typography scale following modular scale
const fontSizes = {
  display: 48,
  h1: 34,
  h2: 28,
  h3: 24,
  h4: 20,
  lg: 18,
  base: 16,
  sm: 14,
  xs: 12,
  xxs: 11,
} as const;

// Line heights for better readability
const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

const fontFamily = {
  primary: "Figtree",
  mono: "SF Mono", // For code/monospace text
} as const;

const fontWeights = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

const fontStyles = StyleSheet.create({
  bold: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeights.bold,
  },
  semiBold: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeights.semiBold,
  },
  medium: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeights.medium,
  },
  regular: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeights.regular,
  },
});

const letterSpacing = {
  tight: -0.02,
  bitTight: -0.01,
  none: 0,
  bitLoose: 0.005,
  loose: 0.01,
} as const;

// Border radius system
const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadow system
const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const lightTheme = {
  colors: {
    // Brand colors
    primary: "#0078ff",
    primaryHover: "#005bbb",
    primaryLight: "#55a5ff",
    accent: "#ff9800",
    secondary: "#000000",

    // Background colors
    background: "#f9f9fb",
    surface: "#ffffff",
    surfaceSecondary: "#f5f5f7",

    // Text colors
    text: {
      primary: "#1c1c1e",
      secondary: "#6e6e73",
      accent: "#005dc6",
      danger: "#d00416",
      success: "#1fc16b",
      warning: "#ff9800",
      inverse: "#ffffff",
    },

    // Interactive elements
    button: {
      primary: "#0078ff",
      primaryHover: "#005bbb",
      secondary: "#f5f5f7",
      secondaryHover: "#e8e8ed",
      disabled: "#c7c7cc",
      text: "#ffffff",
      textDisabled: "#f8f8fd",
      textSecondary: "#1c1c1e",
      outline: "#0078ff",
      outlineHover: "#005bbb",
    },

    // Form elements
    input: {
      background: "#ffffff",
      border: "#e5e5ea",
      borderFocus: "#0078ff",
      placeholder: "#a2a2a8",
    },

    // Status colors
    status: {
      success: "#1fc16b",
      warning: "#ff9800",
      error: "#d00416",
      info: "#0078ff",
    },

    // UI elements
    border: "#e5e5ea",
    shadow: "#0000001a",
    overlay: "#00000066",
    divider: "#d1d1d6",

    // Legacy colors for backward compatibility
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
  spacing,
  margins,
  fontSizes,
  fontFamily,
  fontWeights,
  fontStyles,
  lineHeights,
  letterSpacing,
  borderRadius,
  shadows,
} as const;

export const darkTheme = {
  colors: {
    // Brand colors
    primary: "#1a73e8",
    primaryHover: "#005bbb",
    primaryLight: "#55a5ff",
    accent: "#ff9800",
    secondary: "#ffffff",

    // Background colors
    background: "#1A1A1A",
    surface: "#2C2C2E",
    surfaceSecondary: "#1e1e20",

    // Text colors
    text: {
      primary: "#e5e5ea",
      secondary: "#a2a2a8",
      accent: "#55a5ff",
      danger: "#fd828c",
      success: "#84ebb4",
      warning: "#ffb84d",
      inverse: "#1c1c1e",
    },

    // Interactive elements
    button: {
      primary: "#1a73e8",
      primaryHover: "#005bbb",
      secondary: "#3a3a3c",
      secondaryHover: "#48484a",
      disabled: "#2C2C2E",
      text: "#ffffff",
      textDisabled: "#4C4C4E",
      textSecondary: "#e5e5ea",
      outline: "#1a73e8",
      outlineHover: "#005bbb",
    },

    // Form elements
    input: {
      background: "#2c2c2e",
      border: "#3a3a3c",
      borderFocus: "#1a73e8",
      placeholder: "#6e6e73",
    },

    // Status colors
    status: {
      success: "#84ebb4",
      warning: "#ffb84d",
      error: "#fd828c",
      info: "#55a5ff",
    },

    // UI elements
    border: "#3a3a3c",
    shadow: "#00000066",
    overlay: "#000000cc",
    divider: "#3a3a3c",

    // Legacy colors for backward compatibility
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
  spacing,
  margins,
  fontSizes,
  fontFamily,
  fontWeights,
  fontStyles,
  lineHeights,
  letterSpacing,
  borderRadius,
  shadows: {
    sm: {},
    md: {},
    lg: {},
  },
} as const;
// Theme types for better TypeScript support
export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeColors = Theme["colors"];
export type ThemeSpacing = Theme["spacing"];
export type ThemeFontSizes = Theme["fontSizes"];

// Utility functions for theme usage
export const getThemeColor = (theme: Theme, colorPath: string): string => {
  const keys = colorPath.split(".");
  let value: any = theme.colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return typeof value === "string" ? value : theme.colors.primary;
};

// Common component styles using theme
export const createThemedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      ...theme.shadows.md,
    },
    // Primary button
    button: {
      backgroundColor: theme.colors.button.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.colors.button.text,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semiBold,
    },
    // Secondary button (filled neutral)
    buttonSecondary: {
      backgroundColor: theme.colors.button.secondary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondaryText: {
      color: theme.colors.button.textSecondary,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semiBold,
    },
    // Outline button (transparent with border)
    buttonOutline: {
      backgroundColor: "transparent",
      borderColor: theme.colors.button.outline,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonOutlineText: {
      color: theme.colors.button.outline,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semiBold,
    },
    // Tertiary button (text only)
    buttonTertiary: {
      backgroundColor: "transparent",
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTertiaryText: {
      color: theme.colors.button.primary,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.medium,
    },
    // Disabled button
    buttonDisabled: {
      backgroundColor: theme.colors.button.disabled,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabledText: {
      color: theme.colors.button.textDisabled,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semiBold,
    },
    // Accent button
    buttonAccent: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonAccentText: {
      color: "#ffffff",
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semiBold,
    },
    // Button size variants
    buttonSmall: {
      backgroundColor: theme.colors.button.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSmallText: {
      color: theme.colors.button.text,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semiBold,
    },
    buttonLarge: {
      backgroundColor: theme.colors.button.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonLargeText: {
      color: theme.colors.button.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semiBold,
    },
    input: {
      backgroundColor: theme.colors.input.background,
      borderColor: theme.colors.input.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
    },
    text: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.fontSizes.base * theme.lineHeights.normal,
    },
    textSecondary: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm * theme.lineHeights.normal,
    },
    heading: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.h3,
      fontWeight: theme.fontWeights.bold,
      lineHeight: theme.fontSizes.h3 * theme.lineHeights.tight,
    },
  });

// Default theme (can be switched based on system preference)
export const defaultTheme = lightTheme;

// Theme context helpers
export const isLightTheme = (theme: Theme): theme is typeof lightTheme => {
  return theme.colors.background === lightTheme.colors.background;
};

export const isDarkTheme = (theme: Theme): theme is typeof darkTheme => {
  return theme.colors.background === darkTheme.colors.background;
};
