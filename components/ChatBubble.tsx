// import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { memo } from "react";
import { Alert, Clipboard, Text, TouchableOpacity, View } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";

import { useTheme } from "@/hooks/useTheme";

interface ChatBubbleProps {
  content: string;
  time: string;
  isSender?: boolean;
  isLast?: boolean;
  fileUrl?: string;
  fileType?: string;
}

export const ChatBubble = memo(function ChatBubble({
  content,
  time,
  isSender = false,
  isLast = false,
  fileUrl,
  fileType,
}: ChatBubbleProps) {
  const theme = useTheme();

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("Message Options", content, [
      {
        text: "Copy",
        onPress: async () => {
          Clipboard.setString(content);
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={300}
      activeOpacity={0.8}
      style={{
        flexDirection: isSender ? "row-reverse" : "row",
        marginTop: 4,
        alignItems: "flex-end",
        gap: 8,
        marginBottom: isLast ? 24 : 4,
        paddingHorizontal: 4,
      }}
    >
      {/* Avatar placeholder */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: isSender
            ? theme.colors.appPrimary
            : theme.colors.appTextSecondary,
          opacity: 0.8,
        }}
      />

      <View style={{ maxWidth: "75%", gap: 2 }}>
        <View
          style={{
            backgroundColor: isSender
              ? theme.colors.appPrimary
              : theme.colors.appSurface,
            borderRadius: 18,
            borderBottomRightRadius: isSender ? 4 : 18,
            borderBottomLeftRadius: isSender ? 18 : 4,
            paddingVertical: 2,
            paddingHorizontal: 16,
            shadowColor: theme.colors.appDropShadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Markdown
            markdownit={MarkdownIt({ typographer: true })}
            style={{
              body: {
                color: isSender ? "#FFFFFF" : theme.colors.appTextPrimary,
                ...theme.fontStyles.regular,
                fontSize: theme.fontSizes.base,
              },
            }}
          >
            {content}
          </Markdown>
          {/* <Text
            style={{
              color: isSender ? "#FFFFFF" : theme.colors.appTextPrimary,
              ...theme.fontStyles.regular,
              fontSize: theme.fontSizes.base,
              lineHeight: 20,
            }}
          >
            {content}
          </Text> */}
        </View>

        {time && (
          <Text
            style={{
              ...theme.fontStyles.regular,
              fontSize: theme.fontSizes.xs,
              color: theme.colors.appTextSecondary,
              textAlign: isSender ? "right" : "left",
              marginHorizontal: 4,
            }}
          >
            {formatTime(time)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});
