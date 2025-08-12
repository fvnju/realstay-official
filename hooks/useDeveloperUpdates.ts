import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  type: "feature" | "bugfix" | "info" | "warning";
  date: string;
}

// Sample updates - replace with your actual updates
const CURRENT_UPDATES: UpdateItem[] = [
  {
    id: "1",
    title: "Chat Interface has been re-enabled",
    description: "Changes now reflect API update and with a new UI",
    type: "info",
    date: "Dec 8, 2024",
  },
  {
    id: "2",
    title: "Reserving a property",
    description: "Reserving a property sends a message to the owner",
    type: "bugfix",
    date: "Dec 7, 2024",
  },
  {
    id: "3",
    title: "Listing Upload implemented",
    description:
      "Listing upload has been implemented. Might be buggy due to state management",
    type: "feature",
    date: "Dec 6, 2024",
  },
  {
    id: "4",
    title: "Uploading pictures don't work for now",
    description: "Upload api endpoint is down",
    type: "warning",
    date: "Dec 6, 2024",
  },
];

const CURRENT_VERSION = "0.1.2"; // Update this with your app version

export const useDeveloperUpdates = () => {
  const [showModal, setShowModal] = useState(false);
  const [updates] = useState(CURRENT_UPDATES);
  const [isAlwaysShowEnabled, setIsAlwaysShowEnabled] = useState(false);

  useEffect(() => {
    checkShouldShowUpdates();
  }, []);

  const checkShouldShowUpdates = async () => {
    try {
      console.log("🔍 Checking if should show updates...");

      // Check if user has enabled "always show updates" setting
      const alwaysShowUpdates = await SecureStore.getItemAsync(
        "always_show_updates"
      );
      console.log("📱 Always show setting:", alwaysShowUpdates);

      const alwaysShow = alwaysShowUpdates === "true";
      setIsAlwaysShowEnabled(alwaysShow);

      if (alwaysShow && updates.length > 0) {
        console.log("✅ Showing modal - always show enabled");
        setShowModal(true);
        return;
      }

      // Default behavior: only show if user hasn't seen this version's updates
      const hasSeenUpdates = await SecureStore.getItemAsync(
        `updates_seen_${CURRENT_VERSION}`
      );
      console.log(
        "👀 Has seen updates for version",
        CURRENT_VERSION,
        ":",
        hasSeenUpdates
      );

      if (!hasSeenUpdates && updates.length > 0) {
        console.log("✅ Showing modal - first time seeing this version");
        setShowModal(true);
      } else {
        console.log("❌ Not showing modal - already seen or no updates");
      }
    } catch (error) {
      console.error("Error checking updates status:", error);
    }
  };

  const hideModal = () => {
    setShowModal(false);
  };

  // Function to toggle the "always show updates" setting
  const toggleAlwaysShowUpdates = async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync("always_show_updates", enabled.toString());
    } catch (error) {
      console.error("Error saving always show updates setting:", error);
    }
  };

  // Function to get current "always show updates" setting
  const getAlwaysShowUpdatesSetting = async (): Promise<boolean> => {
    try {
      const setting = await SecureStore.getItemAsync("always_show_updates");
      return setting === "true";
    } catch (error) {
      console.error("Error getting always show updates setting:", error);
      return false;
    }
  };

  // Function to manually show updates (useful for settings page)
  const showUpdatesManually = () => {
    setShowModal(true);
  };

  // Function to reset updates (for testing)
  const resetUpdatesForTesting = async () => {
    try {
      await SecureStore.deleteItemAsync(`updates_seen_${CURRENT_VERSION}`);
      await SecureStore.deleteItemAsync("always_show_updates");
      console.log("🧹 Cleared all update settings for testing");
    } catch (error) {
      console.error("Error clearing update settings:", error);
    }
  };

  return {
    showModal,
    hideModal,
    updates,
    version: CURRENT_VERSION,
    isAlwaysShowEnabled,
    toggleAlwaysShowUpdates,
    getAlwaysShowUpdatesSetting,
    showUpdatesManually,
    resetUpdatesForTesting,
  };
};
