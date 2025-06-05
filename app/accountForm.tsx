import Checkbox from "expo-checkbox";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import { useAtomValue } from "jotai";
import { CaretDown } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";

import { passwordAtom } from "./createPassword";

import { PrimaryButton } from "@/components/Button/Primary";
import { DropdownMenu, MenuOption } from "@/components/DropDown";
import TextField from "@/components/TextField";
import ENDPOINT from "@/constants/endpoint";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner-native";

// Name validator - allows letters, spaces, and hyphens, 2-50 characters
const nameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(
    /^[a-zA-Z\s-]+$/,
    "Name can only contain letters, spaces, and hyphens"
  );

// Nigerian phone number validator
const nigerianPhoneValidator = z
  .string()
  .transform((val) => {
    // Remove all non-digit characters
    const digits = val.replace(/\D/g, "");

    // If number starts with 0, replace with 234
    if (digits.startsWith("0")) {
      return "234" + digits.slice(1);
    }

    // If number starts with 234, return as is
    if (digits.startsWith("234")) {
      return digits;
    }

    // If number starts with +234, remove the +
    if (digits.startsWith("+234")) {
      return digits.slice(1);
    }

    // If number is 10 digits, prepend 234
    if (digits.length === 10) {
      return "234" + digits;
    }

    return digits;
  })
  .refine(
    (val) => val.length === 13 && val.startsWith("234"),
    "Phone number must be a valid Nigerian number"
  );

export default function AccountForm() {
  const password = useAtomValue(passwordAtom);
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [gender, setGender] = useState("Not Specified");
  const [isHost, setIsHost] = useState(false);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone_number, setPhone_Number] = useState("");

  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);

  const createAccount = async () => {
    const isFirstNameValid = nameValidator.safeParse(first_name).success;
    const isLastNameValid = nameValidator.safeParse(last_name).success;
    const phoneResult = nigerianPhoneValidator.safeParse(phone_number);
    const isPhoneValid = phoneResult.success;

    if (!isFirstNameValid && !isLastNameValid && !isPhoneValid) {
      toast.error("Form wasn't filled properly");
      return null;
    }

    const resp = await fetch(`${ENDPOINT}/auth/signup`, {
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        gender,
        phone_number: phoneResult.data,
        user_type: isHost ? "host" : "guest",
      }),
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "RealStayApp",
      },
    });
    const result = await resp.json();

    if (resp.status === 201) {
      toast.success("Account created!");
      router.dismissTo({ pathname: "/email" });
    } else {
      toast.error("Something went wrong...");
    }
    console.log(resp.status);
    console.log(result);
  };

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
        }}
      />
      <Text
        style={{
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.xl_4,
          color: theme.color.appTextPrimary,
        }}
      >
        Fill this form
      </Text>
      <View style={{ marginTop: 40, flexDirection: "row", gap: 16 }}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text
            style={{
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.base,
              color: theme.color.appTextPrimary,
            }}
          >
            First Name
          </Text>
          <TextField
            autoComplete="cc-name"
            ref={inputRef1}
            onChangeText={(text) => {
              setFirst_name(text);
            }}
          />
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <Text
            style={{
              ...theme.fontStyles.semiBold,
              fontSize: theme.fontSizes.base,
              color: theme.color.appTextPrimary,
            }}
          >
            Last Name
          </Text>
          <TextField
            autoComplete="cc-family-name"
            ref={inputRef2}
            onChangeText={(text) => setLast_name(text)}
          />
        </View>
      </View>

      <View style={{ marginTop: 24, gap: 8 }}>
        <Text
          style={{
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.base,
            color: theme.color.appTextPrimary,
          }}
        >
          Phone Number
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              aspectRatio: 1,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              backgroundColor: theme.color.appSurface,
            }}
          >
            <Text>🇳🇬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="e.g. 08012345678"
              accessibilityLabel="phone number"
              importantForAutofill="yes"
              keyboardType="phone-pad"
              autoComplete="tel"
              ref={inputRef3}
              onChangeText={(text) => setPhone_Number(text)}
            />
          </View>
        </View>
      </View>

      <View style={{ marginTop: 24, gap: 8 }}>
        <Text
          style={{
            color: theme.color.appTextPrimary,
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.base,
          }}
        >
          Gender
        </Text>
        <DropdownMenu
          itemsBackgroundColor={theme.color.appSurface}
          visible={visible}
          handleOpen={() => {
            setVisible(true);
            inputRef1.current?.blur();
            inputRef2.current?.blur();
            inputRef3.current?.blur();
          }}
          handleClose={() => setVisible(false)}
          trigger={
            <View
              style={[
                styles.triggerStyle,
                {
                  borderColor: theme.color.elementsTextFieldBorder,
                  backgroundColor: theme.color.elementsTextFieldBackground,
                  borderWidth: 3,
                  gap: 8,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  ...theme.fontStyles.regular,
                  color: theme.color.appTextSecondary,
                }}
              >
                {gender}
              </Text>
              <CaretDown
                weight="light"
                color={theme.color.appTextSecondary}
                size={20}
              />
            </View>
          }
        >
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setGender("Female");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              Female
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setGender("Male");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              Male
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setGender("Not Specified");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              Not Specified
            </Text>
          </MenuOption>
        </DropdownMenu>
      </View>

      <Pressable
        style={{
          marginTop: 24,
          gap: 12,
          flexDirection: "row",
          height: 48,
          alignSelf: "flex-start",
          justifyContent: "center",
        }}
        onPress={() => {
          setIsHost((past) => !past);
          inputRef1.current?.blur();
          inputRef2.current?.blur();
          inputRef3.current?.blur();
        }}
      >
        <Text
          style={{
            color: theme.color.appTextPrimary,
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.base,
          }}
        >
          Will you be listing property?
        </Text>
        <Checkbox
          color={theme.color.appTextAccent}
          style={{ borderRadius: 6 }}
          value={isHost}
          onValueChange={(val) => {
            setIsHost(val);
            inputRef1.current?.blur();
            inputRef2.current?.blur();
            inputRef3.current?.blur();
          }}
        />
      </Pressable>

      <PrimaryButton style={{ marginTop: 64 - 24 }} onPress={createAccount}>
        Create Account
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  triggerStyle: {
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // width: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
    alignSelf: "flex-start",
  },
});
