import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FormSectionProps } from "../types";

export const FormSection: React.FC<FormSectionProps> = ({ label, children, hint }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: theme.colors.appTextPrimary },
          theme.fontStyles.semiBold,
        ]}
      >
        {label}
      </Text>
      {children}
      {hint && (
        <Text
          style={[
            styles.hint,
            { color: theme.colors.appTextSecondary },
            theme.fontStyles.medium,
          ]}
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = {
  container: {
    gap: 8,
  } as ViewStyle,
  label: {
    fontSize: 16,
  },
  hint: {
    fontSize: 14,
  },
};
