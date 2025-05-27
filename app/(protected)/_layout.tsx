import { jwtAtom, loadJWT } from "@/utils/jwt";
import { Redirect, Stack } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import * as SecureStore from "expo-secure-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
  const jwt = SecureStore.getItem("access_token");

  if (jwt === null) {
    // Login Screen
    return <Redirect href={"/onboarding"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
