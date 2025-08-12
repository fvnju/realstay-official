import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useValidationDebug } from "../hooks/useValidationDebug";

interface ValidationIndicatorProps {
  step: number;
  showDetails?: boolean;
}

/**
 * Debug component to show validation state
 * Only use in development - remove from production
 */
export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  step,
  showDetails = false,
}) => {
  const theme = useTheme();
  const { validations } = useValidationDebug();

  const stepKey = `step${step}` as keyof typeof validations;
  const validation = validations[stepKey];

  if (!validation) return null;

  const isValid = validation.isValid;
  const errorCount = Object.keys(validation.errors).length;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isValid
            ? theme.colors.status?.success + "20" || "#10B981" + "20"
            : theme.colors.status?.error + "20" || "#EF4444" + "20",
          borderColor: isValid
            ? theme.colors.status?.success || "#10B981"
            : theme.colors.status?.error || "#EF4444",
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: isValid
              ? theme.colors.status?.success || "#10B981"
              : theme.colors.status?.error || "#EF4444",
          },
        ]}
      >
        Step {step}:{" "}
        {isValid
          ? "✓ Valid"
          : `✗ ${errorCount} Error${errorCount !== 1 ? "s" : ""}`}
      </Text>

      {showDetails && !isValid && (
        <View style={styles.errorList}>
          {Object.entries(validation.errors).map(
            ([field, error]) =>
              error && (
                <Text
                  key={field}
                  style={[
                    styles.errorText,
                    { color: theme.colors.status?.error || "#EF4444" },
                  ]}
                >
                  • {field}: {error}
                </Text>
              )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    margin: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorList: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 2,
  },
});
