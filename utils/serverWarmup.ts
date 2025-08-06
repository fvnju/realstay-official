import { useEffect, useState } from "react";
import ENDPOINT from "@/constants/endpoint";
import { toast } from "sonner-native";

// Status of the server warmup process
export type ServerStatus = "unknown" | "warming-up" | "ready" | "error";

// Configure the warmup parameters
const WARMUP_CONFIG = {
  // Timeout for the warmup request in milliseconds
  TIMEOUT_MS: 30000,
  // Endpoint to ping for warmup (should be lightweight)
  // Using an existing endpoint that should be quick to respond
  PING_ENDPOINT: "/users/check-email-availability?email=ping@example.com",
  // Maximum retry attempts
  MAX_RETRIES: 2,
  // Delay between retries in milliseconds
  RETRY_DELAY_MS: 2000,
};

/**
 * Pings the server to check if it's awake
 * @returns Promise that resolves when server is ready, rejects on error
 */
export const pingServer = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    WARMUP_CONFIG.TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${ENDPOINT}${WARMUP_CONFIG.PING_ENDPOINT}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    clearTimeout(timeoutId);

    // For our warmup ping, we don't care about the actual response
    // as long as the server responded at all
    if (response.status >= 200 && response.status < 500) {
      return true;
    }

    throw new Error(`Server returned ${response.status}`);
  } catch (error) {
    clearTimeout(timeoutId);
    // @ts-expect-error error type
    if (error.name === "AbortError") {
      throw new Error("Server warmup timed out");
    }
    throw error;
  }
};

/**
 * Attempts to warm up the server with retries
 */
export const warmupServer = async (): Promise<boolean> => {
  let retries = 0;

  while (retries <= WARMUP_CONFIG.MAX_RETRIES) {
    try {
      const success = await pingServer();
      return success;
    } catch (error) {
      retries++;

      // If we've exceeded retries, throw the error
      if (retries > WARMUP_CONFIG.MAX_RETRIES) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, WARMUP_CONFIG.RETRY_DELAY_MS),
      );
    }
  }

  return false;
};

/**
 * Hook to manage server warmup state
 */
export const useServerWarmup = () => {
  const [status, setStatus] = useState<ServerStatus>("unknown");
  const [isReady, setIsReady] = useState(false);

  const checkServer = async () => {
    setStatus("warming-up");

    try {
      await warmupServer();
      setStatus("ready");
      setIsReady(true);
      console.log("Server warmup successful");
    } catch (error) {
      console.error("Server warmup failed:", error);
      setStatus("error");
      toast.error(
        "Server is currently starting up. This may take up to 30 seconds.",
      );
    }
  };

  // Call this function to manually trigger a server warmup
  const warmupServerManually = async () => {
    setStatus("warming-up");
    setIsReady(false);

    try {
      await warmupServer();
      setStatus("ready");
      setIsReady(true);
      return true;
    } catch (error) {
      console.error("Manual server warmup failed:", error);
      setStatus("error");
      toast.error("Unable to connect to server. Please try again later.");
      return false;
    }
  };

  return {
    status,
    isReady,
    checkServer,
    warmupServerManually,
  };
};
