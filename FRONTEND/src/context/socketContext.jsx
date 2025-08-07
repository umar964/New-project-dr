// src/context/SocketContext.jsx
import { createContext, useContext, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [orderNotification, setOrderNotification] = useState(null);

  return (
    <SocketContext.Provider value={{ orderNotification, setOrderNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
