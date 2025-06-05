import ENDPOINT from "@/constants/endpoint";
import * as SecureStore from "expo-secure-store";
import { toast } from "sonner-native";
import { ServerStatus, warmupServer } from "./serverWarmup";

// Define request options interface
interface ApiRequestOptions extends RequestInit {
  handleColdStart?: boolean;
  requiresAuth?: boolean;
  showErrorToast?: boolean;
}

// Define response type
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  serverStatus: ServerStatus;
}

// Default API request options
const DEFAULT_OPTIONS: ApiRequestOptions = {
  handleColdStart: true,
  requiresAuth: false,
  showErrorToast: true,
};

/**
 * Fetches the authentication token from secure storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync("access_token");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

/**
 * Makes an API request with cold start handling
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> => {
  // Merge options with defaults
  const mergedOptions: ApiRequestOptions = { ...DEFAULT_OPTIONS, ...options };
  const { handleColdStart, requiresAuth, showErrorToast, ...fetchOptions } =
    mergedOptions;

  // Build the complete URL
  const url = `${ENDPOINT}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Add authorization header if required
  if (requiresAuth) {
    const token = await getAuthToken();
    if (!token) {
      if (showErrorToast) {
        toast.error("Authentication required. Please log in.");
      }
      return {
        data: null,
        error: "Authentication required",
        status: 401,
        serverStatus: "error",
      };
    }

    // Add auth header to existing headers or create new headers object
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Set default headers if not provided
  fetchOptions.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchOptions.headers,
  };

  try {
    // Make the API request
    const response = await fetch(url, fetchOptions);

    // Handle cold start detection (server taking too long or 503 status)
    if (
      !response.ok &&
      handleColdStart &&
      (response.status === 503 || response.status === 502)
    ) {
      // Server is likely in cold start
      if (showErrorToast) {
        toast.info("Server is starting up, please wait...");
      }

      // Try to warm up the server
      try {
        await warmupServer();

        // Retry the original request after warmup
        const retryResponse = await fetch(url, fetchOptions);

        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return {
            data,
            error: null,
            status: retryResponse.status,
            serverStatus: "ready",
          };
        } else {
          const errorData = await retryResponse.text();
          if (showErrorToast) {
            toast.error("Request failed after server warmup");
          }
          return {
            data: null,
            error: errorData,
            status: retryResponse.status,
            serverStatus: "error",
          };
        }
      } catch (warmupError) {
        if (showErrorToast) {
          toast.error("Server is currently unavailable");
        }
        return {
          data: null,
          error: "Server is unavailable",
          status: 503,
          serverStatus: "error",
        };
      }
    }

    // Process successful response
    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        data,
        error: null,
        status: response.status,
        serverStatus: "ready",
      };
    } else {
      // Handle regular errors
      const errorText = await response.text();
      let errorMessage;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }

      if (showErrorToast) {
        toast.error(errorMessage || "An error occurred");
      }

      return {
        data: null,
        error: errorMessage,
        status: response.status,
        serverStatus: "ready",
      };
    }
  } catch (error) {
    // Handle network errors
    // @ts-expect-error error type
    const errorMessage = error.message || "Network error";

    if (showErrorToast) {
      toast.error(errorMessage);
    }

    return {
      data: null,
      error: errorMessage,
      status: 0,
      serverStatus: "error",
    };
  }
};

/**
 * Convenience method for GET requests
 */
export const get = <T>(endpoint: string, options: ApiRequestOptions = {}) => {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
};

/**
 * Convenience method for POST requests
 */
export const post = <T>(
  endpoint: string,
  data: any,
  options: ApiRequestOptions = {},
) => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Convenience method for PUT requests
 */
export const put = <T>(
  endpoint: string,
  data: any,
  options: ApiRequestOptions = {},
) => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Convenience method for PATCH requests
 */
export const patch = <T>(
  endpoint: string,
  data: any,
  options: ApiRequestOptions = {},
) => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * Convenience method for DELETE requests
 */
export const del = <T>(endpoint: string, options: ApiRequestOptions = {}) => {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
};
