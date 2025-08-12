import { ChatBubble } from "@/components/ChatBubble";
import React, { forwardRef, useCallback } from "react";
import { FlatList } from "react-native";
import { ChatSocketResponse } from "../hooks/useChatData";

interface MessageListProps {
  messages: ChatSocketResponse[];
  currentUserId: string;
}

export const MessageList = forwardRef<FlatList, MessageListProps>(
  ({ messages, currentUserId }, ref) => {
    const renderItem = useCallback(
      ({ item, index }: { item: ChatSocketResponse; index: number }) => (
        <ChatBubble
          time={item.timestamp?.toString() || ""}
          isLast={index === messages.length - 1}
          isSender={!(item.senderId === currentUserId)}
          content={item.content}
        />
      ),
      [messages.length, currentUserId]
    );

    return (
      <FlatList
        ref={ref}
        style={{ flex: 1, paddingHorizontal: 16 }}
        data={messages}
        keyExtractor={(item, index) => item._id || `temp-${index}`}
        renderItem={renderItem}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    );
  }
);
