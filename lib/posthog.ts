import PostHog from "posthog-react-native";

// Create a single shared PostHog client
export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY!, // from app config / env
  {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
    captureAppLifecycleEvents: true,
  }
);
