import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = WebSocket | null;

const SocketContext = createContext<SocketContextType>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
      console.log("Connected to Python socket");
      setSocket(ws);
      ws.send(JSON.stringify({type: "message", message: "Hello from React!"}));
    };

    ws.onclose = () => {
      console.log("Disconnected from Python socket");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.log("WebSocket Error: ", error);
      setSocket(null);
    };

    // Cleanup on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
