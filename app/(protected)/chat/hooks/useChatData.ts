import ENDPOINT from "@/constants/endpoint";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "expo/fetch";

export interface ChatSocketResponse {
  __v?: number;
  _id?: string;
  content: string;
  conversationId?: string;
  fileType?: string;
  fileUrl?: string;
  read?: boolean;
  receiverId?: string;
  senderId?: string;
  timestamp?: string;
}

export interface UserDetails {
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

async function getAllMessages(
  token: string,
  id: string
): Promise<Record<number, ChatSocketResponse>> {
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

  const data = await response.json();
  return data.data;
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
  return data.data.user as UserDetails;
}

export function useChatData(token: string | null, id: string) {
  const messagesQuery = useQuery({
    queryKey: [`chat/${id}`],
    queryFn: () => getAllMessages(token!, id),
    enabled: !!token && !!id,
  });

  const userQuery = useQuery({
    queryKey: [`user/${id}`],
    queryFn: () => getUserDetails(token!, id),
    enabled: !!token && !!id,
  });

  return {
    messages: messagesQuery.data,
    messagesLoading: messagesQuery.isLoading,
    messagesError: messagesQuery.error,
    user: userQuery.data,
    userLoading: userQuery.isLoading,
    userError: userQuery.error,
    isLoading: messagesQuery.isLoading || userQuery.isLoading,
    error: messagesQuery.error || userQuery.error,
  };
}
