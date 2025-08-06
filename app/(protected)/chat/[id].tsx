import { useQuery } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import { useAtomValue } from "jotai";
import {
  CaretLeft,
  DotsThreeVertical,
  LinkSimple,
  PaperPlaneTilt,
  X,
} from "phosphor-react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ENDPOINT from "@/constants/endpoint";
import { useSocketRef } from "@/hooks/useSocket";
import { useTheme } from "@/hooks/useTheme";
import { jwtAtom } from "@/utils/jwt";

import ProgressCircle from "@/components/ProgressCircle";
import { Image } from "expo-image";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

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
  id: string
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
      `HTTP error! status: ${response.status}. ${JSON.stringify(
        await response.json()
      )}`
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
      `HTTP error! status: ${response.status}. ${JSON.stringify(
        await response.json()
      )}`
    );
  }

  const data = await response.json();
  return data.user as UserDetails;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
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
      })
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
  }, [socketRef, id]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatSocketResponse; index: number }) => (
      <ChatBubble
        time={item.timestamp?.toString() || ""}
        isLast={index === messages.length - 1}
        isSender={!(item["senderId"] === id)}
        content={item.content}
      />
    ),
    [messages.length, id]
  );

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const uploadProgress = useSharedValue(0);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsMultipleSelection: true,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
      uploadProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.linear,
      });
    }
  };
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    console.log(result);
  };
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaStatus, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        // paddingTop: 8,
        paddingBottom: bottom,
        // paddingHorizontal: 16,
        flex: 1,
        backgroundColor: theme.color.appBackground,
        height: Dimensions.get("screen").height,
      }}
    >
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: theme.color.appBackground,
          },
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
                  backgroundColor: theme.color.appBackground,
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

      <View>
        {image && (
          <View
            style={{
              marginLeft: 16 / 2,
              flexDirection: "row",
              position: "relative",
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.color.appSurface,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: image.uri }}
              style={{
                height: 120,
                width: (120 * image.width) / image.height,
                opacity: 0.5,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                setImage(null);
                uploadProgress.value = withTiming(0, {
                  duration: 200,
                  easing: Easing.linear,
                });
              }}
              style={{
                position: "absolute",
                right: 4,
                top: 4,
                zIndex: 9,
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.color.appDropShadow,
                borderRadius: 999,
              }}
            >
              <X size={16} weight="bold" color={theme.color.appTextPrimary} />
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProgressCircle progress={uploadProgress} radius={12} />
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 8,
            paddingTop: 8,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (!cameraStatus?.granted) {
                  requestCameraPermission();
                }
                if (!mediaStatus?.granted) {
                  requestMediaPermission();
                }
              }}
            >
              <LinkSimple
                color={theme.color.appTextPrimary}
                weight="bold"
                size={24}
              />
            </TouchableOpacity>
          </View>

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
      </View>
    </KeyboardAvoidingView>
  );
}

const ChatBubble = memo(function ChatBubble({
  content,
  time,
  isSender = false,
  isLast = false,
}: {
  content: string;
  time: string;
  isSender?: boolean;
  isLast?: boolean;
}) {
  const theme = useTheme();

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleCopy = async () => {
    // Implement copy functionality
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        <View style={{ maxWidth: "75%", overflow: "hidden", borderRadius: 14 }}>
          <Text
            style={{
              // borderRadius: 16,
              backgroundColor: isSender
                ? theme.color.appPrimary
                : theme.color.appSurface,
              // maxWidth: "75%",
              color: isSender ? "#FFFFFF" : theme.color.appTextPrimary,
              ...theme.fontStyles.regular,
              fontSize: theme.fontSizes.base,
              lineHeight: 24,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            {content}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
});
