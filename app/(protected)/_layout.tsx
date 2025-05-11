import { jwtAtom, loadJWT } from "@/utils/jwt";
import { Redirect, Stack } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
  const jwt = useAtomValue(jwtAtom);

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
