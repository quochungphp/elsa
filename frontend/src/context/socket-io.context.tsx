import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, socket } from "../utils/socket.io";

const SocketContext = createContext(socket);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    connectSocket();

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
