import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAtomValue, useSetAtom } from "jotai";
import { PostHogProvider } from "posthog-react-native";
import { Fragment, useEffect } from "react";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toast, Toaster } from "sonner-native";

import { appearanceAtom, useTheme } from "@/hooks/useTheme";

import DeveloperUpdatesModal from "@/components/DeveloperUpdatesModal";
import ServerWarmupOverlay from "@/components/ServerWarmupOverlay";
import { useDeveloperUpdates } from "@/hooks/useDeveloperUpdates";
import { posthog } from "@/lib/posthog";
import { getCurrentLocation, locationAtom } from "@/utils/location";
import { useServerWarmup } from "@/utils/serverWarmup";
import "expo-dev-client";
import "react-native-reanimated";
import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,
    debug: false
});

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
    if (!state.isConnected) {
      toast.error("You appear to not be connected to any network");
    }
  });
  return eventSubscription.remove;
});
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function RootLayout() {
  const setCurrentLocation = useSetAtom(locationAtom);
  useEffect(() => {
    const getLocation = async () => {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    };
    getLocation();
  }, [setCurrentLocation]);
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

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <Fragment>
      <StatusBar style="auto" />
      <PostHogProvider client={posthog}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SafeAreaProvider>
            <GestureHandlerRootView>
              <QueryClientProvider client={queryClient}>
                <BottomSheetModalProvider>
                  <View
                    style={{
                      backgroundColor: theme.colors.appBackground,
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
                        statusBarBackgroundColor: theme.colors.appBackground,
                        contentStyle: {
                          backgroundColor: theme.colors.appBackground,
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
              </QueryClientProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ThemeProvider>
      </PostHogProvider>
    </Fragment>
  );
}

export default Sentry.wrap(RootLayout);
