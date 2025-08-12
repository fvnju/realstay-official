import { useTheme } from "@/hooks/useTheme";
import { useAtomValue } from "jotai";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  step1ValidationAtom,
  step5ValidationAtom,
  step6ValidationAtom,
} from "../store";

interface FormValidationProps {
  step: 1 | 5 | 6;
}

export const FormValidation: React.FC<FormValidationProps> = ({ step }) => {
  const theme = useTheme();

  const step1Validation = useAtomValue(step1ValidationAtom);
  const step5Validation = useAtomValue(step5ValidationAtom);
  const step6Validation = useAtomValue(step6ValidationAtom);

  const getValidation = () => {
    switch (step) {
      case 1:
        return step1Validation;
      case 5:
        return step5Validation;
      case 6:
        return step6Validation;
      default:
        return { isValid: true, errors: {} };
    }
  };

  const validation = getValidation();
  const errors = Object.values(validation.errors).filter(Boolean);

  if (validation.isValid || errors.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.status?.error + "10" || "#EF444410" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.status?.error || "#EF4444" },
        ]}
      >
        Please fix the following errors:
      </Text>
      {errors.map((error, index) => (
        <Text
          key={index}
          style={[
            styles.error,
            { color: theme.colors.status?.error || "#EF4444" },
          ]}
        >
          • {error}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    marginLeft: 8,
  },
});
