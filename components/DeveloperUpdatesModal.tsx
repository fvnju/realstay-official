import { useTheme } from "@/hooks/useTheme";
import { BlurView } from "expo-blur";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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
  version = "0.1.2",
  alwaysShow = false,
}) => {
  const theme = useTheme();

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(-50);
  const contentSlide = useSharedValue(30);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ translateY: headerSlide.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ translateY: contentSlide.value }],
  }));

  // Entrance animation
  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      modalOpacity.value = withTiming(1, { duration: 400 });
      modalScale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      headerSlide.value = withDelay(
        100,
        withSpring(0, { damping: 15, stiffness: 150 })
      );
      contentSlide.value = withDelay(
        200,
        withSpring(0, { damping: 15, stiffness: 150 })
      );
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      headerSlide.value = withTiming(-50, { duration: 200 });
      contentSlide.value = withTiming(30, { duration: 200 });
    }
  }, [visible]);

  const getTypeConfig = (type: UpdateItem["type"]) => {
    switch (type) {
      case "feature":
        return {
          color: theme.colors.status.success,
          backgroundColor: theme.colors.status.success + "20",
          icon: "✨",
          label: "NEW",
        };
      case "bugfix":
        return {
          color: theme.colors.status.warning,
          backgroundColor: theme.colors.status.warning + "20",
          icon: "🔧",
          label: "FIX",
        };
      case "info":
        return {
          color: theme.colors.status.info,
          backgroundColor: theme.colors.status.info + "20",
          icon: "💡",
          label: "INFO",
        };
      case "warning":
        return {
          color: theme.colors.status.error,
          backgroundColor: theme.colors.status.error + "20",
          icon: "⚠️",
          label: "ALERT",
        };
      default:
        return {
          color: theme.colors.text.secondary,
          backgroundColor: theme.colors.surfaceSecondary,
          icon: "📝",
          label: "NOTE",
        };
    }
  };

  const handleClose = async () => {
    // Exit animation
    overlayOpacity.value = withTiming(0, { duration: 200 });
    modalOpacity.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.9, { duration: 200 });

    // Only store "seen" flag if not in "always show" mode
    if (!alwaysShow) {
      await SecureStore.setItemAsync(`updates_seen_${version}`, "true");
    }

    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />

        <View style={styles.container}>
          <Animated.View
            style={[
              styles.modal,
              modalAnimatedStyle,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {/* Enhanced Header */}
            <Animated.View
              style={[
                styles.header,
                headerAnimatedStyle,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <Text style={styles.emoji}>🎉</Text>
                  <View>
                    <Text
                      style={[
                        styles.title,
                        { color: theme.colors.text.primary },
                        theme.fontStyles.bold,
                      ]}
                    >
                      What's New
                    </Text>
                    <View style={styles.versionContainer}>
                      <View
                        style={[
                          styles.versionBadge,
                          { backgroundColor: theme.colors.surfaceSecondary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.versionText,
                            { color: theme.colors.text.secondary },
                            theme.fontStyles.semiBold,
                          ]}
                        >
                          v{version}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.versionLabel,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        Latest Update
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.closeIconButton,
                    { backgroundColor: theme.colors.surfaceSecondary },
                  ]}
                  onPress={handleClose}
                >
                  <Text
                    style={[
                      styles.closeIcon,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Enhanced Content */}
            <Animated.View
              style={[
                styles.content,
                contentAnimatedStyle,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
              >
                {updates.map((update, index) => {
                  const typeConfig = getTypeConfig(update.type);

                  // Individual item animation
                  const itemOpacity = useSharedValue(0);
                  const itemSlide = useSharedValue(20);

                  useEffect(() => {
                    if (visible) {
                      itemOpacity.value = withDelay(
                        300 + index * 100,
                        withTiming(1, { duration: 400 })
                      );
                      itemSlide.value = withDelay(
                        300 + index * 100,
                        withSpring(0, { damping: 15, stiffness: 150 })
                      );
                    }
                  }, [visible, index]);

                  const itemAnimatedStyle = useAnimatedStyle(() => ({
                    opacity: itemOpacity.value,
                    transform: [{ translateY: itemSlide.value }],
                  }));

                  return (
                    <Animated.View
                      key={update.id}
                      style={[styles.updateItem, itemAnimatedStyle]}
                    >
                      <View
                        style={[
                          styles.updateCard,
                          {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            shadowColor: theme.colors.shadow,
                          },
                        ]}
                      >
                        <View style={styles.updateHeader}>
                          <View style={styles.typeContainer}>
                            <View
                              style={[
                                styles.iconContainer,
                                { backgroundColor: typeConfig.backgroundColor },
                              ]}
                            >
                              <Text style={styles.typeIcon}>
                                {typeConfig.icon}
                              </Text>
                            </View>
                            <View>
                              <View
                                style={[
                                  styles.typeBadge,
                                  { backgroundColor: typeConfig.color },
                                ]}
                              >
                                <Text style={styles.typeText}>
                                  {typeConfig.label}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.updateTitle,
                                  { color: theme.colors.text.primary },
                                  theme.fontStyles.semiBold,
                                ]}
                              >
                                {update.title}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.dateContainer}>
                            <Text
                              style={[
                                styles.date,
                                { color: theme.colors.text.secondary },
                              ]}
                            >
                              {new Date(update.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[
                            styles.updateDescription,
                            { color: theme.colors.text.secondary },
                          ]}
                        >
                          {update.description}
                        </Text>
                      </View>
                    </Animated.View>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {/* Enhanced Footer */}
            <Animated.View
              style={[
                styles.footer,
                contentAnimatedStyle,
                {
                  backgroundColor: theme.colors.surface,
                  borderTopColor: theme.colors.border,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                  },
                ]}
                onPress={handleClose}
              >
                <Text
                  style={[styles.closeButtonText, theme.fontStyles.semiBold]}
                >
                  Awesome, got it!
                </Text>
              </TouchableOpacity>

              {!alwaysShow && (
                <Text
                  style={[
                    styles.footerNote,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  This won't show again for this version
                </Text>
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000B3",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
    width: "105%",
  },
  modal: {
    borderRadius: 24,
    width: "100%",
    maxWidth: 420,
    height: "80%", // Fixed height instead of maxHeight
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    overflow: "hidden",
  },

  // Header Styles
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  versionText: {
    fontSize: 12,
  },
  versionLabel: {
    fontSize: 12,
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Content Styles
  content: {
    flex: 1, // This allows the content to expand
  },
  scrollView: {
    flex: 1, // This ensures ScrollView takes full available height
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexGrow: 1, // This allows content to grow if needed
  },
  updateItem: {
    marginBottom: 16,
  },
  updateCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 18,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  updateTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
  },
  updateDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },

  // Footer Styles
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  closeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
    fontStyle: "italic",
  },
});

export default DeveloperUpdatesModal;
