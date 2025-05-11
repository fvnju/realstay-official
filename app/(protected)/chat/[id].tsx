import { useQuery } from "@tanstack/react-query";
import { fetch } from "expo/fetch";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import {
  CaretLeft,
  DotsThreeVertical,
  LinkSimple,
  PaperPlaneTilt,
  Copy,
  Trash,
} from "phosphor-react-native";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

import ENDPOINT from "@/constants/endpoint";
import { useSocketRef } from "@/hooks/useSocket";
import { useTheme, useThemeType } from "@/hooks/useTheme";
import { jwtAtom } from "@/utils/jwt";

interface ChatSocketResponse {
  __v?: number;
  _id?: string;
  content: string;
  conversationId?: string;
  fileType?: any;
  fileUrl?: any;
  read?: boolean;
  receiverId?: string;
  senderId?: string;
  timestamp?: string;
}

async function getAllMessages(
  token: string,
  id: string,
): Promise<ChatSocketResponse[]> {
  const response = await fetch(`${ENDPOINT}/chat/messages/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
      "User-Agent": "RealStayApp",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}. ${JSON.stringify(await response.json())}`,
    );
  }

  const data: ChatSocketResponse[] = await response.json();
  return data;
}

interface UserDetails {
  _id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  user_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image_url: string;
}

async function getUserDetails(token: string, id: string): Promise<UserDetails> {
  const response = await fetch(`${ENDPOINT}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
      "User-Agent": "RealStayApp",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}. ${JSON.stringify(await response.json())}`,
    );
  }

  const data: UserDetails = await response.json();
  return data;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function ChatBubbleMenu({
  visible,
  onClose,
  onCopy,
  onDelete,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  theme: useThemeType;
}) {
  const { bottom: initialBottom } = useSafeAreaInsets();

  const menuItems: MenuItem[] = [
    {
      icon: <Copy size={24} color={theme.color.appTextPrimary} />,
      label: "Copy",
      onPress: onCopy,
    },
    {
      icon: <Trash size={24} color={theme.color.appTextDanger} />,
      label: "Delete",
      onPress: onDelete,
      destructive: true,
    },
  ];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <BlurView intensity={50} style={{ flex: 1 }}>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.color.appSurface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
              paddingBottom: 16 + initialBottom,
              gap: 8,
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.onPress();
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: theme.color.appBackground,
                }}
              >
                {item.icon}
                <Text
                  style={{
                    color: item.destructive
                      ? theme.color.appTextDanger
                      : theme.color.appTextPrimary,
                    ...theme.fontStyles.medium,
                    fontSize: theme.fontSizes.base,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

export default function ChatPage() {
  const { top, bottom: initialBottom } = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const token = useAtomValue(jwtAtom);

  const [bottom, setBottom] = useState(initialBottom);
  const socketRef = useSocketRef(token!);
  const [messages, setMessages] = useState<ChatSocketResponse[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState({ name: "", type: "" });
  const textRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [`chat/${id}`],
    queryFn: () => getAllMessages(token!, id.toString()),
    enabled: !!token && !!id,
  });
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: [`user/${id}`],
    queryFn: () => getUserDetails(token!, id.toString()),
    enabled: !!token && !!id,
  });

  useEffect(() => {
    if (!isLoading) {
      setMessages(data!);
    }
    if (!userDataLoading) {
      setUser({
        name: `${userData?.first_name!} ${userData?.last_name!}`,
        type: userData?.user_type!,
      });
    }
  }, [isLoading, data, error, userDataLoading, userData]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    socketRef.current?.emit(
      "send_message",
      JSON.stringify({
        receiverId: id,
        content: text.trim(),
        fileUrl: null,
        fileType: null,
      }),
    );

    setMessages((prev) => [...prev, { content: text.trim() }]);
    flatListRef.current?.scrollToEnd({ animated: true });

    setText("");
    textRef.current?.clear();
  };

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on("receive_message", (message: ChatSocketResponse) => {
      console.log("received");
      console.log(message["content"]);
      // console.log(id);
      console.log(message["senderId"] === id);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      console.log("DONE receiving");
    };
  }, [socketRef]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatSocketResponse; index: number }) => (
      <ChatBubble
        isLast={index === messages.length - 1}
        isSender={!(item["senderId"] === id)}
        content={item.content}
      />
    ),
    [messages.length, id],
  );

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        // paddingTop: 8,
        paddingBottom: bottom,
        // paddingHorizontal: 16,
        flex: 1,
        backgroundColor: theme.color.appBackground,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.color.appBackground },
          header(props) {
            return (
              <View
                style={{
                  paddingTop: top,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: theme.color.elementsTextFieldBorder,
                  paddingBottom: 12,
                }}
              >
                <TouchableOpacity
                  onPress={router.back}
                  style={{
                    width: 48,
                    height: 48,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <CaretLeft weight="bold" color={theme.color.appTextPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={{
                      ...theme.fontStyles.bold,
                      fontSize: theme.fontSizes.xl,
                      color: theme.color.appTextPrimary,
                    }}
                  >
                    {user.name}
                  </Text>
                  <Text
                    style={{
                      ...theme.fontStyles.regular,
                      fontSize: theme.fontSizes.sm,
                      color: theme.color.appTextPrimary,
                    }}
                  >
                    {`(${user.type})`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: 48,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <DotsThreeVertical
                    weight="bold"
                    color={theme.color.appTextPrimary}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <FlatList
        ref={flatListRef}
        style={{ flex: 1, paddingHorizontal: 16 }}
        scrollEnabled
        data={messages}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderItem}
        initialNumToRender={20}
        windowSize={10}
      />

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
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkSimple
            color={theme.color.appTextPrimary}
            weight="bold"
            size={24}
          />
        </TouchableOpacity>
        <TextInput
          ref={textRef}
          onChangeText={(val) => setText(val)}
          onFocus={() => setBottom(8)}
          onBlur={() => setBottom(initialBottom)}
          style={{
            flex: 1,
            backgroundColor: theme.color.elementsTextFieldBackground,
            borderRadius: 20,
            height: 48,
            borderWidth: 1,
            borderColor: theme.color.elementsTextFieldBorder,
            paddingHorizontal: 12,
            ...theme.fontStyles.regular,
            fontSize: theme.fontSizes.base,
            color: theme.color.appTextPrimary,
          }}
          placeholder="Write a message"
          placeholderTextColor={theme.color.appTextSecondary}
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
            color={theme.color.appTextAccent}
            weight="bold"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const ChatBubble = memo(function ChatBubble({
  content,
  isSender = false,
  isLast = false,
}: {
  content: string;
  isSender?: boolean;
  isLast?: boolean;
}) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuVisible(true);
  };

  const handleCopy = () => {
    // Implement copy functionality
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = () => {
    // Implement delete functionality
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        delayLongPress={200}
        style={{
          flexDirection: isSender ? "row-reverse" : "row",
          marginTop: 8,
          alignItems: "flex-end",
          gap: 12,
          marginBottom: isLast ? 24 : 8,
        }}
      >
        {/* image later */}
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            backgroundColor: "green",
          }}
        />
        <View
          style={{
            backgroundColor: isSender
              ? theme.color.appPrimary
              : theme.color.appSurface,
            maxWidth: "75%",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: isSender ? "#FFFFFF" : theme.color.appTextPrimary,
              ...theme.fontStyles.regular,
              fontSize: theme.fontSizes.base,
              lineHeight: 24,
            }}
          >
            {content}
          </Text>
        </View>
      </TouchableOpacity>

      <ChatBubbleMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onCopy={handleCopy}
        onDelete={handleDelete}
        theme={theme}
      />
    </>
  );
});
