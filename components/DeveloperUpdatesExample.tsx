import React from "react";
import { StyleSheet } from "react-native";
import { useDeveloperUpdates } from "../hooks/useDeveloperUpdates";
import DeveloperUpdatesModal from "./DeveloperUpdatesModal";

// Example component showing how to use the DeveloperUpdatesModal
const DeveloperUpdatesExample: React.FC = () => {
  const { showModal, hideModal, updates, version } = useDeveloperUpdates();

  // You can also manually trigger the modal for testing
  const showUpdatesManually = () => {
    // This would show the modal regardless of whether user has seen it
    // Useful for testing or if you want a "Show Updates" button in settings
  };

  return (
    <DeveloperUpdatesModal
      alwaysShow
      visible={showModal}
      onClose={hideModal}
      updates={updates}
      version={version}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default DeveloperUpdatesExample;
