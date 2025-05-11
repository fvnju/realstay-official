import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  type TextInput,
  type TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z as zod } from "zod";
import { fromError } from "zod-validation-error";
import { PrimaryButton } from "@/components/Button/Primary";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { fetch } from "expo/fetch";
import ENDPOINT from "@/constants/endpoint";

async function userExist(usersEmail: string): Promise<boolean> {
  const response = await fetch(
    `${ENDPOINT}/users/check-email-availability?email=${usersEmail}`,
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}. ${JSON.stringify(await response.json())}`,
    );
  }

  const data: { user_exist: boolean } = await response.json();
  return data.user_exist;
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

  const [_email, _setEmail] = useState("");

  const _sendEmail = async () => {
    try {
      zod.string().email().parse(_email);
    } catch (err) {
      const error = fromError(err);
      toast.error(error.toString());
      return;
    }
    const emailExist = await userExist(_email);
    // console.log(emailExist);

    if (emailExist) {
      router.push({ pathname: "/enterPassword", params: { email: _email } });
    } else {
      router.push({ pathname: "/createPassword", params: { email: _email } });
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
          disabled={!_email.length}
          style={[{ marginTop: 80 }, !_email.length ? disabled : null]}
          textStyle={[!_email.length ? { color: disabled.color } : {}]}
          onPress={_sendEmail}
        >
          Continue
        </PrimaryButton>

        <View style={{ flex: 2 }} />
        <Text style={[policyText]}>
          By signing up with a service provider or pressing the Continue button,
          you are accepting the{" "}
          <Text
            style={links}
            onPress={async () => {
              const result = await WebBrowser.openBrowserAsync(
                "https://www.google.com",
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
                "https://www.google.com",
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
      backgroundColor: theme.color.elementsButtonDisabled,
      shadowOpacity: 0,
      color: theme.color.elementsButtonDisabledText,
    },
    policyText: {
      ...theme.fontStyles.regular,
      lineHeight: theme.fontSizes.sm * 1.4,
      fontSize: theme.fontSizes.sm,
      color: theme.color.appTextPrimary,
      textAlign: "center",
    },
    links: {
      color: theme.color.appTextAccent,
      textDecorationLine: "underline",
    },
    background: {
      backgroundColor: theme.color.appBackground,
    },
    text: {
      ...theme.fontStyles.semiBold,
      color: theme.color.appTextPrimary,
      fontSize: theme.fontSizes.lg,
    },
    text_2: {
      color: theme.color.appTextSecondary,
    },
    heading: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes.xl_4,
      lineHeight: theme.fontSizes.xl_4 + 6,
      color: theme.color.appTextPrimary,
      marginTop: 16,
    },
    email: {
      color: theme.color.appTextAccent,
    },
    textInput: {
      color: theme.color.appTextPrimary,
      borderWidth: 3,
      borderColor: theme.color.elementsTextFieldBorder,
      backgroundColor: theme.color.elementsTextFieldBackground,
      ...theme.fontStyles.regular,
      fontSize: theme.fontSizes.base,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    activeColor: {
      borderColor: theme.color.elementsTextFieldFocus,
    },
  };
};
