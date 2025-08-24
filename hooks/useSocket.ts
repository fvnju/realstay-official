import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export const useSocketRef = (token: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("wss://real-stay-api.onrender.com", {
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
