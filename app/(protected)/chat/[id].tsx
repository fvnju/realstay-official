import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { jwtAtom } from "@/utils/jwt";

import {
  AttachmentOptions,
  ChatHeader,
  ErrorState,
  ImagePreview,
  LoadingState,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "./components";
import { useChatData, useChatSocket, useImageAttachment } from "./hooks";

export default function ChatPage() {
  const { top, bottom: initialBottom } = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { id, initialMessage } = useLocalSearchParams();
  const token = useAtomValue(jwtAtom);

  const [bottom, setBottom] = useState(initialBottom);
  const [text, setText] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Custom hooks for data and functionality
  const {
    messages: initialMessages,
    user,
    isLoading,
    error,
  } = useChatData(token, id.toString());
  const { messages, setMessages, isTyping, sendMessage, sendTypingIndicator } =
    useChatSocket(token, id.toString());
  const {
    image,
    uploadProgress,
    pickImageFromLibrary,
    takePhoto,
    removeImage,
  } = useImageAttachment();

  // Sync initial messages with socket messages
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleTextChange = (value: string) => {
    setText(value);
    sendTypingIndicator(value.length > 0);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const handleAttachmentPress = (action: () => void) => {
    action();
    setShowAttachmentOptions(false);
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState onRetry={() => router.back()} />;
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : "";
  const userType = user?.user_type || "";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={{
        paddingBottom: bottom,
        flex: 1,
        backgroundColor: theme.colors.appBackground,
      }}
    >
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: theme.colors.appBackground,
          },
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.appBackground },
          header: () => (
            <ChatHeader
              userName={userName}
              userType={userType}
              onBack={() => router.back()}
              paddingTop={top}
            />
          ),
        }}
      />

      <MessageList
        ref={flatListRef}
        messages={messages}
        currentUserId={id.toString()}
      />

      <AttachmentOptions
        visible={showAttachmentOptions}
        onTakePhoto={() => handleAttachmentPress(takePhoto)}
        onPickImage={() => handleAttachmentPress(pickImageFromLibrary)}
      />

      <TypingIndicator visible={isTyping} userName={userName} />

      <>
        <ImagePreview
          image={image}
          uploadProgress={uploadProgress}
          onRemove={removeImage}
        />

        <MessageInput
          text={(initialMessage as string) ?? ""}
          onTextChange={handleTextChange}
          onSend={handleSend}
          onFocus={() => setBottom(8)}
          onBlur={() => setBottom(initialBottom)}
          showAttachmentOptions={showAttachmentOptions}
          onToggleAttachments={() =>
            setShowAttachmentOptions(!showAttachmentOptions)
          }
        />
      </>
    </KeyboardAvoidingView>
  );
}
