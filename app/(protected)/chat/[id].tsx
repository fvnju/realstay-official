import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { jwtAtom } from "@/utils/jwt";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { id, initialMessage } = useLocalSearchParams();
  const token = useAtomValue(jwtAtom);

  const [text, setText] = useState<string>((initialMessage as string) ?? "");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { height } = useWindowDimensions();

  const keyboard = useAnimatedKeyboard();
  const bottomAnimated = useSharedValue(bottom);
  const translateStyle = useAnimatedStyle(() => {
    return {
      // height: height - keyboard.height.value,
      transform: [
        {
          translateY: Math.max(
            -keyboard.height.value
            // -keyboard.height.value + bottomAnimated.value - 8
          ),
        },
      ],
    };
  });
  const scrollPaddingStyle = useAnimatedStyle(() => {
    return {
      paddingTop: keyboard.height.value - bottomAnimated.value,
    };
  });
  // const bottomAnimStyle = useAnimatedStyle(()=>({
  //   paddingTop:
  // }))

  // Custom hooks for data and functionality
  const {
    messages: initialMessages,
    user,
    isLoading,
    error,
    isRefetching,
    refetch,
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

  // Auto-scroll to bottom when messages change or keyboard appears
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, keyboardHeight]);

  const handleTextChange = (value: string) => {
    setText(value);
    sendTypingIndicator(value.length > 0);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const handleInputFocus = () => {
    // Scroll to bottom when input is focused
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
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
    <Fragment>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            marginBottom: 8,
          },
          // translateStyle,
        ]}
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
                onBack={() => {
                  Keyboard.dismiss();
                  setTimeout(() => router.back(), 140);
                }}
                paddingTop={top}
              />
            ),
          }}
        />

        {/* <Animated.View style={scrollPaddingStyle}></Animated.View> */}

        <MessageList
          ref={flatListRef}
          messages={messages}
          currentUserId={id.toString()}
          isRefetching={isRefetching || isLoading}
          refetchFn={refetch}
        />

        <AttachmentOptions
          visible={showAttachmentOptions}
          onTakePhoto={() => handleAttachmentPress(takePhoto)}
          onPickImage={() => handleAttachmentPress(pickImageFromLibrary)}
        />

        <TypingIndicator visible={isTyping} userName={userName} />

        <View>
          <ImagePreview
            image={image}
            uploadProgress={uploadProgress}
            onRemove={removeImage}
          />

          <MessageInput
            text={text}
            onTextChange={handleTextChange}
            onSend={handleSend}
            onFocus={handleInputFocus}
            onBlur={() => {}}
            showAttachmentOptions={showAttachmentOptions}
            onToggleAttachments={() =>
              setShowAttachmentOptions(!showAttachmentOptions)
            }
          />
        </View>
      </Animated.View>
      <Animated.View
        style={{ paddingBottom: bottomAnimated, height: keyboard.height }}
      />
    </Fragment>
  );
}
