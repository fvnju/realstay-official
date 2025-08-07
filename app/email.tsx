import { Stack, useRouter } from "expo-router";

import { PrimaryButton } from "@/components/Button/Primary";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { get, NewApiResponse } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Text,
  type TextInput,
  type TextStyle,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z as zod } from "zod";
import { fromError } from "zod-validation-error";

async function userExist(usersEmail: string): Promise<boolean> {
  const response = await get<NewApiResponse<{ user_exist: boolean }>>(
    `/users/check-email-availability?email=${usersEmail}`,
    { showErrorToast: false }
  );

  if (response.error) {
    toast(response.error);
  }

  console.log(response.data?.data.user_exist);

  return response.data?.data.user_exist || false;
}

export default function EnterEmail() {
  const router = useRouter();
  const styles = styleSheet();
  const {
    background,
    text,
    text_2,
    heading,
    email,
    policyText,
    links,
    disabled,
  } = styles;
  const isTargetTextInput = useRef(false);
  const textFieldRef = useRef<TextInput>(null);
  const { status, warmupServerManually } = useServerWarmup();

  const [_email, _setEmail] = useState(
    SecureStore.getItem("user_info") === null
      ? ""
      : JSON.parse(SecureStore.getItem("user_info")!).email
  );
  const [isChecking, setIsChecking] = useState(false);

  const _sendEmail = async () => {
    try {
      zod.string().email().parse(_email);
    } catch (err) {
      const error = fromError(err);
      toast.error(error.toString());
      return;
    }

    setIsChecking(true);
    try {
      // If server is in cold start, the apiClient will handle it automatically
      const emailExist = await userExist(_email);

      if (emailExist) {
        router.push({ pathname: "/enterPassword", params: { email: _email } });
      } else {
        router.push({ pathname: "/createPassword", params: { email: _email } });
      }
    } catch (error) {
      toast.error("Failed to check email. Please try again.");
      // If there was an error, try to manually warm up the server
      warmupServerManually();
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const _timeOut = setTimeout(() => {
      textFieldRef.current?.focus();
    }, 400);
    return () => {
      clearTimeout(_timeOut);
    };
  }, []);

  const { top, bottom } = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      accessible={false}
      onPress={Keyboard.dismiss}
    >
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: bottom + 12,
          },
          background,
        ]}
      >
        <Stack.Screen
          options={{
            title: "Sign up or sign in with email",
            headerTitle: () => <></>,
            headerShown: true,
            headerBackTitle: "Go back",
            headerStyle: {
              backgroundColor: background.backgroundColor as string,
            },
            headerShadowVisible: false,
            headerBackTitleStyle: text,
            headerTintColor: text_2.color as string,
          }}
        />
        <Text style={heading}>
          Get started with your <Text style={email}>email</Text>.
        </Text>
        <View style={{ height: 8 * 7 }} />
        <TextField
          stateValue={_email}
          defaultValue={_email}
          placeholder="e.g. favour.njoku@icloud.com"
          accessibilityLabel="email"
          autoComplete="email"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="yes"
          keyboardType="email-address"
          ref={textFieldRef}
          clearFunc={() => {
            textFieldRef.current?.clear();
            _setEmail("");
          }}
          onChangeText={(t) => {
            _setEmail(t);
          }}
          returnKeyLabel="Next"
          returnKeyType="next"
          onSubmitEditing={_sendEmail}
        />

        <PrimaryButton
          disabled={!_email.length || isChecking || status === "warming-up"}
          style={[
            { marginTop: 80 },
            !_email.length || isChecking || status === "warming-up"
              ? disabled
              : null,
          ]}
          textStyle={[
            !_email.length || isChecking || status === "warming-up"
              ? { color: disabled.color }
              : {},
          ]}
          onPress={_sendEmail}
        >
          {isChecking || status === "warming-up"
            ? "Please wait..."
            : "Continue"}
        </PrimaryButton>

        <View style={{ flex: 2 }} />
        <Text style={[policyText]}>
          By signing up with a service provider or pressing the Continue button,
          you are accepting the{" "}
          <Text
            style={links}
            onPress={async () => {
              const result = await WebBrowser.openBrowserAsync(
                "https://www.google.com"
              );
            }}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={links}
            onPress={async () => {
              const result = await WebBrowser.openBrowserAsync(
                "https://www.google.com"
              );
            }}
          >
            Privacy Policy
          </Text>
          .
        </Text>
        <View style={{ flex: 1 }} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styleSheet = (): { [key: string]: ViewStyle & TextStyle } => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  return {
    disabled: {
      backgroundColor: theme.colors.elementsButtonDisabled,
      shadowOpacity: 0,
      color: theme.colors.elementsButtonDisabledText,
    },
    policyText: {
      ...theme.fontStyles.regular,
      lineHeight: theme.fontSizes.sm * 1.4,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.appTextPrimary,
      textAlign: "center",
    },
    links: {
      color: theme.colors.appTextAccent,
      textDecorationLine: "underline",
    },
    background: {
      backgroundColor: theme.colors.appBackground,
    },
    text: {
      ...theme.fontStyles.semiBold,
      color: theme.colors.appTextPrimary,
      fontSize: theme.fontSizes.lg,
    },
    text_2: {
      color: theme.colors.appTextSecondary,
    },
    heading: {
      ...theme.fontStyles.bold,
      fontSize: theme.fontSizes.h1,
      lineHeight: theme.fontSizes.h1 + 6,
      color: theme.colors.appTextPrimary,
      marginTop: 16,
    },
    email: {
      color: theme.colors.appTextAccent,
    },
    textInput: {
      color: theme.colors.appTextPrimary,
      borderWidth: 3,
      borderColor: theme.colors.elementsTextFieldBorder,
      backgroundColor: theme.colors.elementsTextFieldBackground,
      ...theme.fontStyles.regular,
      fontSize: theme.fontSizes.base,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    activeColor: {
      borderColor: theme.colors.elementsTextFieldFocus,
    },
  };
};
