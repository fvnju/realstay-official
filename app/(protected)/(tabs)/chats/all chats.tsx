import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { ChatCircle, Checks, User } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { get } from "@/utils/apiClient";
import { jwtAtom } from "@/utils/jwt";
import dayjs from "dayjs";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// API functions
const getUserDetails = async (
  token: string,
  id: string
): Promise<UserDetails> => {
  try {
    const response = await get(`/users/${id}`, {
      requiresAuth: true,
    });

    if (response.data === null) {
      toast.error(`Failed to fetch user details: ${response.error}`, {
        description: response.status.toString(),
      });
    }

    const data = response.data as any;
    console.log(data);
    return data.data.user as UserDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

const getAllMessages = async (
  token: string
): Promise<Record<number, ChatRoom>> => {
  try {
    const response = await get(`/chat/messages`, {
      requiresAuth: true,
    });

    if (response.data === null) {
      toast.error(`Failed to fetch messages: ${response.error}`, {
        description: response.status.toString(),
      });
    }

    const data = response.data as any;
    console.log(data);
    // TODO: Replace with actual data when API is ready
    return data.data as Record<number, ChatRoom>;
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("Failed to load chats");
    throw error;
  }
};

// Loading Component
const LoadingScreen = ({ theme }: { theme: any }) => {
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.textSecondary, { marginTop: 16 }]}>
        Loading chats...
      </Text>
    </View>
  );
};

// Error Component
const ErrorScreen = ({
  error,
  onRetry,
  theme,
}: {
  error: Error;
  onRetry: () => void;
  theme: any;
}) => {
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.centerContainer}>
      <Text style={[styles.text, { marginBottom: 16, textAlign: "center" }]}>
        Failed to load chats
      </Text>
      <TouchableOpacity
        style={componentStyles.retryButton}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={componentStyles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

// Empty State Component
const EmptyState = ({ theme }: { theme: any }) => {
  const componentStyles = createComponentStyles(theme);

  return (
    <View style={componentStyles.emptyContainer}>
      <View style={componentStyles.emptyIconContainer}>
        <ChatCircle
          size={64}
          color={theme.colors.text.secondary}
          weight="light"
        />
      </View>
      <Text style={componentStyles.emptyTitle}>No conversations yet</Text>
      <Text style={componentStyles.emptySubtitle}>
        Start a conversation with property owners or guests
      </Text>
    </View>
  );
};

export default function ChatsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const token = useAtomValue(jwtAtom);

  // Fetch chats
  const {
    data: chats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allChats"],
    queryFn: () => getAllMessages(token!),
    enabled: !!token,
    retry: 2,
    staleTime: 0, // 30 seconds
  });

  // Fetch user details for each chat sender
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: [
      "userDetails",
      chats ? Object.values(chats).map((chat) => chat.senderId) : [],
    ],
    queryFn: async () => {
      if (!chats || Object.keys(chats).length === 0) return [];

      const chatArray = Object.values(chats);
      const uniqueSenderIds = [
        ...new Set(chatArray.map((chat) => chat.senderId)),
      ];
      return Promise.all(
        uniqueSenderIds.map((id) => getUserDetails(token!, id))
      );
    },
    enabled: !!token && !!chats && Object.keys(chats).length > 0,
  });

  // Combine chat data with user details
  const chatData = useMemo(() => {
    if (!chats || !userData) return [];

    const chatArray = Object.values(chats);
    return chatArray.map((chat) => ({
      ...chat,
      senderDetails: userData.find((user) => user._id === chat.senderId),
    }));
  }, [chats, userData]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderChatItem = useCallback(
    ({ item }: { item: ChatItemData }) => (
      <ChatItem chat={item} theme={theme} />
    ),
    [theme]
  );

  const keyExtractor = useCallback((item: ChatItemData) => item._id, []);

  if (isLoading || userDataLoading) {
    return <LoadingScreen theme={theme} />;
  }

  if (error) {
    return (
      <ErrorScreen error={error as Error} onRetry={handleRetry} theme={theme} />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 16, paddingBottom: bottom }]}>
      {chatData.length === 0 ? (
        <EmptyState theme={theme} />
      ) : (
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={componentStyles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={componentStyles.separator} />
          )}
        />
      )}
    </View>
  );
}

// Chat Item Component
const ChatItem = ({ chat, theme }: { chat: ChatItemData; theme: any }) => {
  const router = useRouter();
  const componentStyles = createComponentStyles(theme);

  const handlePress = useCallback(() => {
    router.push(`/chat/${chat.senderId}` as any);
  }, [router, chat.senderId]);

  const displayName = chat.senderDetails
    ? `${chat.senderDetails.first_name} ${chat.senderDetails.last_name}`
    : "Unknown User";

  const formattedTime = dayjs(chat.timestamp).format("h:mm A");
  const isToday = dayjs(chat.timestamp).isSame(dayjs(), "day");
  const displayTime = isToday
    ? formattedTime
    : dayjs(chat.timestamp).format("MMM D");

  return (
    <TouchableOpacity
      style={componentStyles.chatItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={componentStyles.avatar}>
        {chat.senderDetails?.image_url ? (
          // TODO: Add Image component when image URLs are available
          <View style={componentStyles.avatarPlaceholder}>
            <User size={24} color={theme.colors.text.inverse} weight="fill" />
          </View>
        ) : (
          <View style={componentStyles.avatarPlaceholder}>
            <Text style={componentStyles.avatarText}>
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={componentStyles.chatContent}>
        <Text numberOfLines={1} style={componentStyles.chatName}>
          {displayName}
        </Text>

        <View style={componentStyles.messageRow}>
          {chat.read && (
            <Checks
              weight="light"
              size={14}
              color={theme.colors.text.secondary}
            />
          )}
          <Text numberOfLines={1} style={componentStyles.lastMessage}>
            {chat.content || "No message"}
          </Text>
        </View>
      </View>

      {/* Time and Status */}
      <View style={componentStyles.chatMeta}>
        <Text style={componentStyles.timeText}>{displayTime}</Text>

        {!chat.read && <View style={componentStyles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );
};
// Types
interface ChatRoom {
  _id: string;
  messageId: string;
  senderId: string;
  receiverId: string;
  sender?: UserDetails;
  receiver?: UserDetails;
  content: string;
  fileUrl?: string;
  fileType?: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
}

interface ChatItemData extends ChatRoom {
  senderDetails?: UserDetails;
}

// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    header: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
    },
    headerTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.h2 || 28,
      color: theme.colors?.text?.primary || "#000",
      letterSpacing:
        (theme.letterSpacing?.tight || -0.02) * (theme.fontSizes?.h2 || 28),
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      gap: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      overflow: "hidden",
    },
    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors?.primary || "#0078ff",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: "#ffffff",
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
    },
    chatContent: {
      flex: 1,
      gap: 4,
    },
    chatName: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.medium,
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.normal || 1.4),
    },
    messageRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    lastMessage: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      letterSpacing:
        (theme.letterSpacing?.loose || 0.01) * (theme.fontSizes?.sm || 14),
      lineHeight:
        (theme.fontSizes?.sm || 14) * (theme.lineHeights?.normal || 1.4),
      flex: 1,
    },
    chatMeta: {
      alignItems: "flex-end",
      gap: 8,
      minWidth: 60,
    },
    timeText: {
      fontSize: theme.fontSizes?.xs || 12,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      lineHeight:
        (theme.fontSizes?.xs || 12) * (theme.lineHeights?.normal || 1.4),
    },
    unreadIndicator: {
      backgroundColor: theme.colors?.accent || "#ff9800",
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors?.border || "#e5e5ea",
      marginLeft: 68, // Avatar width + gap
      opacity: 0.5,
    },
    retryButton: {
      backgroundColor: theme.colors?.primary || "#0078ff",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius?.md || 8,
    },
    retryButtonText: {
      color: "#ffffff",
      fontSize: theme.fontSizes?.base || 16,
      ...theme.fontStyles.semiBold,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    emptyIconContainer: {
      marginBottom: 24,
      opacity: 0.6,
    },
    emptyTitle: {
      fontSize: theme.fontSizes?.h3 || 24,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
  });
