import { Redirect, Stack, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { atom } from "jotai";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export const avoid_redirect_to_agent = atom(false);

export default function ProtectedLayout() {
  const jwt = SecureStore.getItem("access_token");
  const pathname = usePathname();

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
