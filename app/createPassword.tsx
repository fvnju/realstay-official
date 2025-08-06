import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { atom, useAtom } from "jotai";
import { Check } from "phosphor-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";

import { PrimaryButton } from "@/components/Button/Primary";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";

export const passwordAtom = atom("");

// Validator for checking if string contains both letters and numbers
const hasLetterAndNumber = z.string().refine(
  (val) => {
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    return hasLetter && hasNumber;
  },
  { message: "Password must contain at least one letter and one number" },
);

// Validator for checking if string contains special characters
const hasSpecialCharacter = z.string().refine(
  (val) => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(val);
  },
  { message: "Password must contain at least one special character" },
);

export default function CreatePassword() {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [_password, _setPassword] = useAtom(passwordAtom);

  const isPasswordValid =
    _password.length >= 8 &&
    hasLetterAndNumber.safeParse(_password).success &&
    hasSpecialCharacter.safeParse(_password).success;

  return (
    <View
      style={{
        paddingTop: 24,
        paddingBottom: bottom,
        flex: 1,
        backgroundColor: theme.color.appBackground,
        paddingHorizontal: 16,
      }}
    >
      <Stack.Screen
        options={{
          title: "Create password",
          headerTitle: () => <></>,
          headerShown: true,
          headerBackTitle: "Go back",
          headerStyle: { backgroundColor: theme.color.appBackground },
          headerShadowVisible: false,
          headerBackTitleStyle: {
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.lg,
          },
          headerTintColor: theme.color.appTextSecondary,
          headerRight(props) {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.replace({
                    // @ts-ignore
                    pathname: "/enterPassword",
                    params: { email },
                  });
                }}
              >
                <Text
                  style={{
                    ...theme.fontStyles.semiBold,
                    fontSize: theme.fontSizes.lg,
                    color: theme.color.appTextAccent,
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Text
        style={{
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.xl_4,
          color: theme.color.appTextPrimary,
        }}
      >
        Create a password
      </Text>
      <View style={{ marginTop: 8 * 7, gap: 32 }}>
        <TextField value={`${email}`} editable={false} />
        <TextField
          textContentType="newPassword"
          autoFocus
          enterKeyHint="done"
          spellCheck={false}
          forPassword
          stateValue={_password}
          onChangeText={(t) => _setPassword(t)}
        />
      </View>
      <Text
        style={{
          marginTop: 24,
          color: theme.color.appTextPrimary,
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.base,
        }}
      >
        Your password must have at least:
      </Text>
      <View style={{ marginTop: 12, gap: 12 }}>
        {/* password length */}
        <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
          <Check
            size={16}
            color={
              _password.length >= 8
                ? theme.color.elementsOnlineIndicatorOnline
                : `${theme.color.appTextSecondary}9A`
            }
            weight="bold"
          />
          <Text
            style={{
              color: theme.color.appTextSecondary,
              ...theme.fontStyles.medium,
            }}
          >
            8 characters minimum
          </Text>
        </View>

        {/* alphanumeric */}
        <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
          <Check
            size={16}
            color={
              hasLetterAndNumber.safeParse(_password).success
                ? theme.color.elementsOnlineIndicatorOnline
                : `${theme.color.appTextSecondary}9A`
            }
            weight="bold"
          />
          <Text
            style={{
              color: theme.color.appTextSecondary,
              ...theme.fontStyles.medium,
            }}
          >
            1 letter and 1 number
          </Text>
        </View>

        {/* special character */}
        <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
          <Check
            size={16}
            color={
              hasSpecialCharacter.safeParse(_password).success
                ? theme.color.elementsOnlineIndicatorOnline
                : `${theme.color.appTextSecondary}9A`
            }
            weight="bold"
          />
          <Text
            style={{
              color: theme.color.appTextSecondary,
              ...theme.fontStyles.medium,
            }}
          >
            1 special character (Example: # ? £ & @)
          </Text>
        </View>
      </View>
      <PrimaryButton
        disabled={!isPasswordValid}
        style={[
          { marginTop: 80 },
          !isPasswordValid
            ? {
                backgroundColor: theme.color.elementsButtonDisabled,
                shadowOpacity: 0,
              }
            : null,
        ]}
        textStyle={[
          !isPasswordValid
            ? { color: theme.color.elementsButtonDisabledText }
            : {},
        ]}
        onPress={() => {
          // @ts-ignore
          router.push({ pathname: "/accountForm", params: { email } });
        }}
      >
        Continue
      </PrimaryButton>
    </View>
  );
}
