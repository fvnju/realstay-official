import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDeveloperUpdates } from "../hooks/useDeveloperUpdates";

// Temporary debug component to test the updates modal
const UpdatesDebugger: React.FC = () => {
  const {
    showModal,
    showUpdatesManually,
    resetUpdatesForTesting,
    toggleAlwaysShowUpdates,
    isAlwaysShowEnabled,
  } = useDeveloperUpdates();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Updates Debugger</Text>
      <Text style={styles.status}>
        Modal visible: {showModal ? "YES" : "NO"}
      </Text>
      <Text style={styles.status}>
        Always show enabled: {isAlwaysShowEnabled ? "YES" : "NO"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={showUpdatesManually}>
        <Text style={styles.buttonText}>Show Updates Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={resetUpdatesForTesting}>
        <Text style={styles.buttonText}>Reset All Settings (Test)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => toggleAlwaysShowUpdates(!isAlwaysShowEnabled)}
      >
        <Text style={styles.buttonText}>
          {isAlwaysShowEnabled ? "Disable" : "Enable"} Always Show
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  status: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default UpdatesDebugger;
