import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

import ENDPOINT from "@/constants/endpoint";

export const useSocketRef = (token: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(ENDPOINT, {
      query: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef;
};
