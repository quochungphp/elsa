import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, socket } from "../utils/socket.io";
const SocketContext = createContext(socket);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // Establish connect
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
// import React, { createContext, useContext, useEffect } from "react";
// import { getSocket } from "../utils/socket.io";

// const SocketContext = createContext(getSocket());

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const socket = getSocket();

//   useEffect(() => {
//     socket.connect();

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };
