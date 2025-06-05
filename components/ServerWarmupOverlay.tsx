import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ServerStatus } from "@/utils/serverWarmup";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

interface ServerWarmupOverlayProps {
  status: ServerStatus;
  onRetry: () => void;
  message?: string;
}

const ServerWarmupOverlay: React.FC<ServerWarmupOverlayProps> = ({
  status,
  onRetry,
  message,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show overlay for warming-up or error states
    if (status === "warming-up" || status === "error") {
      setIsVisible(true);
      opacity.value = withTiming(1, { duration: 300, easing: Easing.ease });

      // Start a timer to show elapsed time during warmup
      if (status === "warming-up") {
        const interval = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
        // @ts-expect-error type error
        setTimer(interval);
      }
    } else {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.ease });
      setTimeout(() => setIsVisible(false), 300);

      // Clear timer if exists
      if (timer) {
        clearInterval(timer);
        setTimer(null);
        setElapsedTime(0);
      }
    }

    // Set appropriate message based on status
    switch (status) {
      case "warming-up":
        setStatusMessage(message || "Waking up the server...");
        break;
      case "error":
        setStatusMessage(message || "Failed to connect to server");
        break;
      default:
        setStatusMessage("");
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [status, message]);

  // Format elapsed time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BlurView intensity={50} style={styles.blurContainer}>
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color={theme.color.appTextAccent} />

          <Text style={[styles.message, { color: theme.color.appTextPrimary }]}>
            {statusMessage}
          </Text>

          {status === "warming-up" && (
            <Text
              style={[styles.timeText, { color: theme.color.appTextSecondary }]}
            >
              Elapsed time: {formatTime(elapsedTime)}
            </Text>
          )}

          <Text
            style={[styles.subText, { color: theme.color.appTextSecondary }]}
          >
            {status === "warming-up"
              ? "Free tier servers take time to wake up after being inactive"
              : "There was a problem connecting to the server"}
          </Text>

          {status === "error" && (
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: theme.color.appTextAccent },
              ]}
              onPress={onRetry}
            >
              <Text style={styles.retryText}>Retry Connection</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  blurContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "80%",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  timeText: {
    fontSize: 14,
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },
  subText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default ServerWarmupOverlay;
