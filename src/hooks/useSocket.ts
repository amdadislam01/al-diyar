"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(undefined, {
        reconnectionAttempts: 5,
        timeout: 10000,
      });
    }

    const onConnect = () => {
      setConnected(true);
      console.log("Socket connected:", socket?.id);
    };

    const onDisconnect = () => {
      setConnected(false);
      console.log("Socket disconnected");
    };

    const onConnectError = (err: any) => {
      console.error("Socket connection error:", err);
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("connect_error", onConnectError);
    };
  }, []);

  const joinRoom = useCallback((room: string) => {
    if (socket && connected) {
      socket.emit("join", room);
    }
  }, [connected]);

  const sendMessage = useCallback((data: any) => {
    if (socket && connected) {
      socket.emit("send-message", data);
    }
  }, [connected]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    if (socket) {
      socket.on("receive-message", callback);
      return () => {
        socket?.off("receive-message", callback);
      };
    }
  }, []);

  return {
    socket,
    connected,
    joinRoom,
    sendMessage,
    onMessage,
  };
};
