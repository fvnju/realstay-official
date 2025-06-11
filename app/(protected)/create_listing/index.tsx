import { PrimaryButton } from "@/components/Button/Primary";
import { DropdownMenu, MenuOption } from "@/components/DropDown";
import TextField from "@/components/TextField";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { Camera, CaretDown } from "phosphor-react-native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateListing() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      style={{
        flex: 1,
        paddingTop: top + 12,
        paddingHorizontal: 16,
        backgroundColor: theme.color.appBackground,
      }}
      onPress={Keyboard.dismiss}
    >
      <Stack.Screen
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
      <PrimaryButton
        style={{
          backgroundColor: theme.color.appDropShadow,
          alignSelf: "flex-start",
          width: "auto",
          paddingHorizontal: 24,
        }}
        textStyle={{ color: theme.color.appTextPrimary }}
        onPress={() => {
          Keyboard.dismiss();
          router.back();
        }}
      >
        Exit
      </PrimaryButton>
      <Text
        style={[
          {
            marginTop: 40,
            fontSize: 38,
            color: theme.color.appTextPrimary,
            lineHeight: 40,
          },
          theme.fontStyles.bold,
        ]}
      >
        Add Listing
      </Text>
      <AddListing />
    </Pressable>
  );
}

function AddListing() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [property, setProperty] = useState("House");
  const { bottom } = useSafeAreaInsets();

  const nextAction = () => {
    router.push("/create_listing/part2");
  };

  return (
    <View style={{ marginTop: 24, gap: 32, flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Address
        </Text>
        <TextField autoFocus autoCapitalize="none" autoCorrect={false} />
        <Text
          style={[
            { fontSize: 14, color: theme.color.appTextSecondary },
            theme.fontStyles.medium,
          ]}
        >
          This is just an approximate address that will be shown to guest users
          that hasn’t indicated interest.
        </Text>
      </KeyboardAvoidingView>

      <View style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Get location data
        </Text>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
          onPress={() => {
            const latitude = 9.0573;
            const longitude = 7.4951;
            const label = "Somewhere";

            const url = Platform.select({
              ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
              android: `geo:${latitude},${longitude}?q=${label}`,
            });
            Linking.openURL(url!);
          }}
        >
          Open Maps
        </PrimaryButton>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={[
              { fontSize: 16, color: theme.color.appTextPrimary },
              theme.fontStyles.semiBold,
            ]}
          >
            Upload photos
          </Text>
          <Camera size={20} color={theme.color.appTextAccent} weight="bold" />
        </View>
        <PrimaryButton
          style={{
            backgroundColor: theme.color.appDropShadow,
          }}
          textStyle={{ color: theme.color.appTextPrimary }}
        >
          Open Photos
        </PrimaryButton>
      </View>

      <View style={{ gap: 8 }}>
        <Text
          style={[
            { fontSize: 16, color: theme.color.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          Type of property
        </Text>
        <DropdownMenu
          itemsBackgroundColor={theme.color.appSurface}
          visible={visible}
          handleOpen={() => {
            setVisible(true);
            Keyboard.dismiss();
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
                {property}
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
              setProperty("House");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              House
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setVisible(false);
              setProperty("Land");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                ...theme.fontStyles.regular,
                color: theme.color.appTextPrimary,
              }}
            >
              Land
            </Text>
          </MenuOption>
        </DropdownMenu>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: bottom + 24,
        }}
      >
        <PrimaryButton onPress={nextAction}>Next</PrimaryButton>
      </View>
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
