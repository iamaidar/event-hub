import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useChatSocket = (
  groupId: number,
  onMessage: (msg: any) => void,
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_group", groupId);

    socket.on("new_message", (msg) => {
      onMessage(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [groupId]);

  const sendMessage = (data: {
    groupId: number;
    userId?: number;
    message: string;
  }) => {
    socketRef.current?.emit("send_message", data);
  };

  return { sendMessage };
};
