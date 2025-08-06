import * as SecureStore from "expo-secure-store";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  type: "feature" | "bugfix" | "info" | "warning";
  date: string;
}

interface DeveloperUpdatesModalProps {
  visible: boolean;
  onClose: () => void;
  updates: UpdateItem[];
  version?: string;
  alwaysShow?: boolean;
}

const DeveloperUpdatesModal: React.FC<DeveloperUpdatesModalProps> = ({
  visible,
  onClose,
  updates,
  version = "0.1.0",
  alwaysShow = false,
}) => {
  const getTypeColor = (type: UpdateItem["type"]) => {
    switch (type) {
      case "feature":
        return "#4CAF50";
      case "bugfix":
        return "#FF9800";
      case "info":
        return "#2196F3";
      case "warning":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getTypeIcon = (type: UpdateItem["type"]) => {
    switch (type) {
      case "feature":
        return "✨";
      case "bugfix":
        return "🔧";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      default:
        return "📝";
    }
  };

  const handleClose = async () => {
    // Only store "seen" flag if not in "always show" mode
    if (!alwaysShow) {
      await SecureStore.setItemAsync(`updates_seen_${version}`, "true");
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>What's New</Text>
              <Text style={styles.version}>Version {version}</Text>
            </View>

            {updates.map((update) => (
              <View key={update.id} style={styles.updateItem}>
                <View style={styles.updateHeader}>
                  <View style={styles.typeContainer}>
                    <Text style={styles.typeIcon}>
                      {getTypeIcon(update.type)}
                    </Text>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: getTypeColor(update.type) },
                      ]}
                    >
                      <Text style={styles.typeText}>
                        {update.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.date}>
                    {"unkown date" /* update.date */}
                  </Text>
                </View>
                <Text style={styles.updateTitle}>{update.title}</Text>
                <Text style={styles.updateDescription}>
                  {update.description}
                </Text>
              </View>
            ))}

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 700,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#666666",
  },
  content: {
    flex: 1,
    padding: 20,
    height: 600,
  },
  updateItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  date: {
    fontSize: 12,
    color: "#999999",
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DeveloperUpdatesModal;
