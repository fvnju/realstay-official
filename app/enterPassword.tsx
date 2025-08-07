import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  type TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/Button/Primary";
import TextField from "@/components/TextField";
import ENDPOINT from "@/constants/endpoint";
import { useTheme } from "@/hooks/useTheme";
import * as SecureStore from "expo-secure-store";
import { toast } from "sonner-native";

import { jwtAtom, saveJWT } from "@/utils/jwt";
import { useSetAtom } from "jotai";

export default function EnterPassword() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const styles = styleSheet();
  const { background, text, text_2, heading, policyText, links, disabled } =
    styles;

  const [_password, _setPassword] = useState("");
  const { bottom } = useSafeAreaInsets();
  const setJWT = useSetAtom(jwtAtom);

  const findUserType = async (id: string, token: string) => {
    const resp = await fetch(`${ENDPOINT}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "RealStayApp",
      },
    });
    const result = await resp.json();
    // console.log(`user_type ${JSON.stringify(result)}`);
    return await result.data.user.user_type;
  };

  const loginToAccount = async () => {
    toast.dismiss();
    const loading_id = toast.loading("loading...");
    const resp = await fetch(`${ENDPOINT}/auth/login`, {
      body: JSON.stringify({
        email,
        password: _password,
      }),
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "RealStayApp",
      },
    });
    const result = await resp.json();
    toast.dismiss(loading_id);
    if (resp.ok) {
      const token = result.data["access_token"];
      const userData = result.data.user;
      saveJWT(token, setJWT);

      const userType = await findUserType(userData.id, token);

      await SecureStore.setItemAsync(
        "user_info",
        JSON.stringify({ ...userData, user_type: userType })
      );
      if (userType === "host") {
        router.replace({ pathname: "/enterHost" });
      } else {
        while (router.canGoBack()) {
          router.back();
        }
        router.replace({ pathname: "/" });
      }
    } else if (!resp.ok) {
      // console.log(result);
      toast.error(`${result.data.message} - Status code: ${resp.status}`);
    } else {
      toast.error("Something went wrong!");
    }
  };
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: bottom + 16,
          },
          background,
        ]}
      >
        <Stack.Screen
          options={{
            title: "Enter password to account",
            headerTitle: () => <></>,
            headerShown: true,
            headerBackTitle: "Go back",

            headerStyle: {
              backgroundColor: background.backgroundColor?.toString(),
            },
            headerShadowVisible: false,
            headerBackTitleStyle: {
              fontFamily: text.fontFamily,
              fontSize: text.fontSize,
            },
            headerTintColor: text_2.color?.toString(),
            headerRight(props) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.replace({
                      pathname: "/createPassword",
                      params: { email },
                    });
                  }}
                >
                  <Text style={[styles.text, { color: styles.links.color }]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Text style={heading}>Log into your account.</Text>
        <View style={{ marginTop: 8 * 7, gap: 32 }}>
          <TextField value={`${email}`} editable={false} />
          <TextField
            autoFocus
            enterKeyHint="done"
            spellCheck={false}
            forPassword
            stateValue={_password}
            onChangeText={(t) => _setPassword(t)}
            //onEndEditing={loginToAccount}
          />
        </View>

        <PrimaryButton
          disabled={!_password.length}
          style={[{ marginTop: 80 }, !_password.length ? disabled : null]}
          textStyle={[!_password.length ? { color: disabled.color } : {}]}
          onPress={loginToAccount}
        >
          Continue
        </PrimaryButton>

        <View style={{ flex: 2 }} />
        <Text style={[policyText]}>
          By signing up with a service provider or pressing the Continue button,
          you are accepting the <Text style={links}>Terms of Service</Text> and{" "}
          <Text style={links}>Privacy Policy</Text>.
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
    _email_: {
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
