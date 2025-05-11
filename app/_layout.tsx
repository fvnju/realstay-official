import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAtomValue, useSetAtom } from "jotai";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

import { appearanceAtom, useTheme } from "@/hooks/useTheme";

import "react-native-reanimated";
import "expo-dev-client";
import { jwtAtom, loadJWT } from "@/utils/jwt";

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function RootLayout() {
  const colorScheme = useAtomValue(appearanceAtom);
  const theme = useTheme();

  loadJWT(useSetAtom(jwtAtom));

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <View
                style={{
                  backgroundColor: theme.color.appBackground,
                  flex: 1,
                }}
              >
                <Stack
                  screenOptions={{
                    animation: Platform.select({
                      ios: "ios_from_right",
                      android: "simple_push",
                    }),
                    fullScreenGestureEnabled: true,
                    headerShown: false,
                    statusBarBackgroundColor: theme.color.appBackground,
                    contentStyle: {
                      backgroundColor: theme.color.appBackground,
                    },
                  }}
                />
              </View>

              <Toaster closeButton richColors />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
