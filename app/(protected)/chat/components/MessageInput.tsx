import { useTheme } from "@/hooks/useTheme";
import {
  type MarkdownRange,
  MarkdownTextInput,
  parseExpensiMark,
} from "@expensify/react-native-live-markdown";
import * as Haptics from "expo-haptics";
import { PaperPlaneTilt, X } from "phosphor-react-native";
import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";

function parser(input: string): MarkdownRange[] {
  "worklet";
  const range: MarkdownRange[] = parseExpensiMark(input);
  return range;
}

interface MessageInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  onFocus: () => void;
  onBlur: () => void;
  showAttachmentOptions: boolean;
  onToggleAttachments: () => void;
}

export function MessageInput({
  text,
  onTextChange,
  onSend,
  onFocus,
  onBlur,
  showAttachmentOptions,
  onToggleAttachments,
}: MessageInputProps) {
  const theme = useTheme();
  const textRef = useRef<MarkdownTextInput>(null);

  const handleSend = () => {
    onSend();
    // No need to clear manually since we're using controlled input
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 8,
        paddingTop: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggleAttachments();
        }}
        style={{
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: showAttachmentOptions ? "45deg" : "0deg" }],
        }}
      >
        <X color={theme.colors.appTextPrimary} weight="bold" size={24} />
      </TouchableOpacity>

      <MarkdownTextInput
        parser={parser}
        ref={textRef}
        defaultValue={text}
        onChangeText={onTextChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        multiline
        maxLength={1000}
        style={{
          flex: 1,
          backgroundColor: theme.colors.elementsTextFieldBackground,
          borderRadius: 20,
          minHeight: 48,
          maxHeight: 120,
          borderWidth: 1,
          borderColor: theme.colors.elementsTextFieldBorder,
          paddingHorizontal: 16,
          paddingVertical: 12,
          ...theme.fontStyles.regular,
          fontSize: theme.fontSizes.base,
          color: theme.colors.appTextPrimary,
          textAlignVertical: "center",
        }}
        placeholder="Write a message..."
        placeholderTextColor={theme.colors.appTextSecondary}
      />

      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim()}
        style={{
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          opacity: !text.trim() ? 0.5 : 1,
        }}
      >
        <PaperPlaneTilt
          color={theme.colors.appTextAccent}
          weight="bold"
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
}
