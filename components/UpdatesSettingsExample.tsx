import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useDeveloperUpdates } from "../hooks/useDeveloperUpdates";

// Example settings component for managing developer updates preferences
const UpdatesSettingsExample: React.FC = () => {
  const {
    toggleAlwaysShowUpdates,
    getAlwaysShowUpdatesSetting,
    showUpdatesManually,
  } = useDeveloperUpdates();

  const [alwaysShowEnabled, setAlwaysShowEnabled] = useState(false);

  useEffect(() => {
    loadCurrentSetting();
  }, []);

  const loadCurrentSetting = async () => {
    const currentSetting = await getAlwaysShowUpdatesSetting();
    setAlwaysShowEnabled(currentSetting);
  };

  const handleToggleAlwaysShow = async (value: boolean) => {
    setAlwaysShowEnabled(value);
    await toggleAlwaysShowUpdates(value);
  };

  const handleShowUpdatesNow = () => {
    showUpdatesManually();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Updates Settings</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Always Show Updates</Text>
          <Text style={styles.settingDescription}>
            Show developer updates every time you open the app
          </Text>
        </View>
        <Switch
          value={alwaysShowEnabled}
          onValueChange={handleToggleAlwaysShow}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={alwaysShowEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleShowUpdatesNow}>
        <Text style={styles.buttonText}>Show Updates Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UpdatesSettingsExample;
