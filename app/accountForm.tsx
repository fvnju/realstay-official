import Checkbox from "expo-checkbox";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import { useAtomValue } from "jotai";
import { CaretDown } from "phosphor-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import z from "zod";

import { passwordAtom } from "./createPassword";

import { PrimaryButton } from "@/components/Button/Primary";
import { DropdownMenu, MenuOption } from "@/components/DropDown";
import TextField from "@/components/TextField";
import ENDPOINT from "@/constants/endpoint";
import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";

// Validation schemas
const nameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(
    /^[a-zA-Z\s-]+$/,
    "Name can only contain letters, spaces, and hyphens"
  );

const nigerianPhoneValidator = z
  .string()
  .transform((val) => {
    const digits = val.replace(/\D/g, "");

    if (digits.startsWith("0")) return "234" + digits.slice(1);
    if (digits.startsWith("234")) return digits;
    if (digits.startsWith("+234")) return digits.slice(1);
    if (digits.length === 10) return "234" + digits;

    return digits;
  })
  .refine(
    (val) => val.length === 13 && val.startsWith("234"),
    "Phone number must be a valid Nigerian number"
  );

// Form data type
interface FormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  isHost: boolean;
}

// Gender options
const GENDER_OPTIONS = [
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
  { label: "Not Specified", value: "Not Specified" },
] as const;

export default function AccountForm() {
  const password = useAtomValue(passwordAtom);
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { email } = useLocalSearchParams();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone_number: "",
    gender: "Not Specified",
    isHost: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for input management
  const inputRefs = {
    firstName: useRef<TextInput>(null),
    lastName: useRef<TextInput>(null),
    phone: useRef<TextInput>(null),
  };

  const blurAllInputs = useCallback(() => {
    Object.values(inputRefs).forEach((ref) => ref.current?.blur());
  }, []);

  const updateFormData = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const firstNameResult = nameValidator.safeParse(formData.first_name);
    const lastNameResult = nameValidator.safeParse(formData.last_name);
    const phoneResult = nigerianPhoneValidator.safeParse(formData.phone_number);

    if (!firstNameResult.success) {
      toast.error("Invalid first name", {
        description: firstNameResult.error.errors[0]?.message,
      });
      return null;
    }

    if (!lastNameResult.success) {
      toast.error("Invalid last name", {
        description: lastNameResult.error.errors[0]?.message,
      });
      return null;
    }

    if (!phoneResult.success) {
      toast.error("Invalid phone number", {
        description: phoneResult.error.errors[0]?.message,
      });
      return null;
    }

    return {
      ...formData,
      phone_number: phoneResult.data,
    };
  }, [formData]);

  const createAccount = useCallback(async () => {
    if (isSubmitting) return;

    const validatedData = validateForm();
    if (!validatedData) return;

    setIsSubmitting(true);
    blurAllInputs();

    try {
      const response = await fetch(`${ENDPOINT}/auth/signup`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "User-Agent": "RealStayApp",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          gender: validatedData.gender,
          phone_number: validatedData.phone_number,
          user_type: validatedData.isHost ? "host" : "guest",
        }),
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success("Account created successfully!");
        router.dismissTo({ pathname: "/email" });
      } else {
        toast.error("Account creation failed", {
          description:
            result.message || result.error || `Status: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Network error", {
        description: "Please check your connection and try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateForm, blurAllInputs, email, password, router]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: 24, paddingBottom: bottom, paddingHorizontal: 16 },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Create Account",
          headerTitle: () => <></>,
          headerShown: true,
          headerBackTitle: "Go back",
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerBackTitleStyle: {
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.lg,
          },
          headerTintColor: theme.colors.text.secondary,
        }}
      />

      <Text style={[styles.heading, { fontSize: theme.fontSizes.h1 }]}>
        Fill this form
      </Text>
      <View style={componentStyles.nameRow}>
        <View style={componentStyles.nameField}>
          <Text style={styles.text}>First Name</Text>
          <TextField
            autoComplete="given-name"
            ref={inputRefs.firstName}
            value={formData.first_name}
            onChangeText={(text) => updateFormData("first_name", text)}
          />
        </View>
        <View style={componentStyles.nameField}>
          <Text style={styles.text}>Last Name</Text>
          <TextField
            autoComplete="family-name"
            ref={inputRefs.lastName}
            value={formData.last_name}
            onChangeText={(text) => updateFormData("last_name", text)}
          />
        </View>
      </View>

      <View style={componentStyles.fieldContainer}>
        <Text style={styles.text}>Phone Number</Text>
        <View style={componentStyles.phoneRow}>
          <View
            style={[
              componentStyles.countryCode,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text>🇳🇬</Text>
          </View>
          <View style={componentStyles.phoneInput}>
            <TextField
              placeholder="e.g. 08012345678"
              accessibilityLabel="phone number"
              keyboardType="phone-pad"
              autoComplete="tel"
              ref={inputRefs.phone}
              value={formData.phone_number}
              onChangeText={(text) => updateFormData("phone_number", text)}
            />
          </View>
        </View>
      </View>

      <View style={componentStyles.fieldContainer}>
        <Text style={styles.text}>Gender</Text>
        <DropdownMenu
          itemsBackgroundColor={theme.colors.surface}
          visible={dropdownVisible}
          handleOpen={() => {
            setDropdownVisible(true);
            blurAllInputs();
          }}
          handleClose={() => setDropdownVisible(false)}
          trigger={
            <View
              style={[
                componentStyles.dropdownTrigger,
                {
                  borderColor: theme.colors.input.border,
                  backgroundColor: theme.colors.input.background,
                },
              ]}
            >
              <Text style={[styles.textSecondary, { fontSize: 16 }]}>
                {formData.gender}
              </Text>
              <CaretDown
                weight="light"
                color={theme.colors.text.secondary}
                size={20}
              />
            </View>
          }
        >
          {GENDER_OPTIONS.map((option) => (
            <MenuOption
              key={option.value}
              onSelect={() => {
                setDropdownVisible(false);
                updateFormData("gender", option.value);
              }}
            >
              <Text style={[styles.text, { fontSize: 16 }]}>
                {option.label}
              </Text>
            </MenuOption>
          ))}
        </DropdownMenu>
      </View>

      <Pressable
        style={componentStyles.checkboxContainer}
        onPress={() => {
          updateFormData("isHost", !formData.isHost);
          blurAllInputs();
        }}
      >
        <Text style={styles.text}>Will you be listing property?</Text>
        <Checkbox
          color={theme.colors.primary}
          style={componentStyles.checkbox}
          value={formData.isHost}
          onValueChange={(val) => {
            updateFormData("isHost", val);
            blurAllInputs();
          }}
        />
      </Pressable>

      <PrimaryButton
        style={componentStyles.submitButton}
        onPress={createAccount}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </PrimaryButton>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  nameRow: {
    marginTop: 40,
    flexDirection: "row",
    gap: 16,
  },
  nameField: {
    flex: 1,
    gap: 8,
  },
  fieldContainer: {
    marginTop: 24,
    gap: 8,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryCode: {
    aspectRatio: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  phoneInput: {
    flex: 1,
  },
  dropdownTrigger: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  checkboxContainer: {
    marginTop: 24,
    gap: 12,
    flexDirection: "row",
    height: 48,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  checkbox: {
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 40,
  },
});
