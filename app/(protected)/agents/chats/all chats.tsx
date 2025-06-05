import ENDPOINT from "@/constants/endpoint";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import { useAtomValue } from "jotai";
import { Checks } from "phosphor-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { jwtAtom } from "@/utils/jwt";

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

  const data: UserDetails = await response.json();
  return data;
}

interface ChatRoom {
  _id: string;
  messageId: string;
  senderId: string;
  receiverId: string;
  sender: any;
  receiver: any;
  content: string;
  fileUrl: any;
  fileType: any;
  timestamp: string;
  read: boolean;
  readAt: any;
}

async function getAllMessages(token: string): Promise<ChatRoom[]> {
  const response = await fetch(`${ENDPOINT}/chat/messages`, {
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

  const data: ChatRoom[] = await response.json();
  return data;
}

export default function Chats() {
  const theme = useTheme();
  const token = useAtomValue(jwtAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["allChats"],
    queryFn: () => getAllMessages(token!),
    enabled: !!token, // Only run the query if we have a token
  });

  // Fetch user details for each chat sender
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["userDatas", data?.map((c) => c.senderId).join(",")], // depend on senderIds
    queryFn: async () => {
      if (!data) return [];
      return Promise.all(
        data.map((item) => getUserDetails(token!, item.senderId))
      );
    },
    enabled: !!token && !!data,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    useEffect(() => {
      const timeout = setTimeout(() => {
        router.dismissTo("/email");
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }, []);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.color.appBackground,
        paddingHorizontal: 16,
        paddingTop: 32,
        gap: 24,
      }}
    >
      {data?.map((chat, idx) => (
        <ChatItem
          time={dayjs(chat.timestamp).format("h:mm A")}
          name={
            userData?.[idx]
              ? `${userData[idx].first_name} ${userData[idx].last_name}`
              : "Unknown"
          }
          lastMessage={chat.content}
          key={chat.senderId}
          id={chat.senderId}
        />
      ))}
    </View>
  );
}

function ChatItem({
  id,
  lastMessage,
  name,
  time,
}: {
  id: string;
  lastMessage: string;
  name: string;
  time: string;
}) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", gap: 8 }}
      onPress={() => {
        // @ts-ignore
        router.push(`/chat/${id}`);
      }}
    >
      <View
        style={{
          backgroundColor: "blue",
          width: 56,
          height: 56,
          borderRadius: 999,
        }}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: theme.fontSizes.base,
            color: theme.color.appTextPrimary,
            ...theme.fontStyles.medium,
            lineHeight: 24,
          }}
        >
          {name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Checks
            weight="light"
            size={16}
            color={theme.color.appTextSecondary}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.fontSizes.sm,
              color: theme.color.appTextSecondary,
              ...theme.fontStyles.regular,
              letterSpacing: theme.letterSpacing.loose * theme.fontSizes.sm,
              lineHeight: 20,
            }}
          >
            {lastMessage}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: 10 }}>
        <Text
          style={{
            fontSize: theme.fontSizes.base,
            color: theme.color.appTextSecondary,
            ...theme.fontStyles.regular,
            lineHeight: 24,
          }}
        >
          {time}
        </Text>
        <View
          style={{
            backgroundColor: theme.color.appAccent,
            width: 8,
            height: 8,
            borderRadius: 999,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
