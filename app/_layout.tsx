import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toast, Toaster } from "sonner-native";

import { appearanceAtom, useTheme } from "@/hooks/useTheme";

import DeveloperUpdatesModal from "@/components/DeveloperUpdatesModal";
import ServerWarmupOverlay from "@/components/ServerWarmupOverlay";
import { useDeveloperUpdates } from "@/hooks/useDeveloperUpdates";
import { useServerWarmup } from "@/utils/serverWarmup";
import "expo-dev-client";
import "react-native-reanimated";

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
    if (!state.isConnected) {
      toast.error("You appear to not be connected to any network");
    }
  });
  return eventSubscription.remove;
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function RootLayout() {
  const colorScheme = useAtomValue(appearanceAtom);
  const theme = useTheme();
  const { status, isReady, checkServer, warmupServerManually } =
    useServerWarmup();
  const { showModal, hideModal, updates, version, isAlwaysShowEnabled } =
    useDeveloperUpdates();

  // Check server status on app initialization
  useEffect(() => {
    // Attempt to warm up the server when the app starts
    checkServer();
  }, []);

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

                {/* Server warmup overlay */}
                <ServerWarmupOverlay
                  status={status}
                  onRetry={warmupServerManually}
                />

                {/* Developer updates modal */}
                <DeveloperUpdatesModal
                  visible={showModal}
                  onClose={hideModal}
                  updates={updates}
                  version={version}
                  alwaysShow={isAlwaysShowEnabled}
                />

                {/* Temporary debugger - remove this later */}
                {/* <UpdatesDebugger /> */}
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
