import { useSocketRef } from "@/hooks/useSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatSocketResponse } from "./useChatData";

export function useChatSocket(token: string | null, receiverId: string) {
  const socketRef = useSocketRef(token!);
  const [messages, setMessages] = useState<Record<number, ChatSocketResponse>>(
    {}
  );
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  console.log(messages);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      socketRef.current?.emit(
        "send_message",
        JSON.stringify({
          receiverId,
          content: content.trim(),
          fileUrl: null,
          fileType: null,
        })
      );

      const tempMessage: ChatSocketResponse = {
        content: content.trim(),
        timestamp: new Date().toISOString(),
        senderId: "temp",
      };

      setMessages((prev) => {
        const nextId = Math.max(...Object.keys(prev).map(Number), -1) + 1;
        return { ...prev, [nextId]: tempMessage };
      });
    },
    [socketRef, receiverId]
  );

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (socketRef.current) {
        socketRef.current.emit("typing", {
          receiverId,
          isTyping,
        });

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("typing", {
              receiverId,
              isTyping: false,
            });
          }, 1000);
        }
      }
    },
    [socketRef, receiverId]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (socket === null) return;

    const handleReceiveMessage = (message: ChatSocketResponse) => {
      setMessages((prev) => {
        const filteredPrev = Object.fromEntries(
          Object.entries(prev).filter(([_, msg]) => msg.senderId !== "temp")
        );
        const nextId =
          Math.max(...Object.keys(filteredPrev).map(Number), -1) + 1;
        return { ...filteredPrev, [nextId]: message };
      });
    };

    const handleTyping = (data: { senderId: string; isTyping: boolean }) => {
      if (data.senderId === receiverId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("receive_message", (message) => {
      console.log("received");
      handleReceiveMessage(message);
    });
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [socketRef, receiverId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Convert Record to array for components that expect arrays
  const messagesArray = Object.values(messages);

  return {
    messages: messagesArray,
    setMessages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
  };
}
