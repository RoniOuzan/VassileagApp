import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

export const ratingTypes = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physicality",
];

export const positionOptions: Position[] = [
  "ST",
  "LW",
  "RW",
  "LM",
  "RM",
  "CAM",
  "CM",
  "CDM",
  "LB",
  "RB",
  "CB",
  "GK",
];

export type Position =
    | "ST" | "LW" | "RW" | "LM" | "RM" | "CAM" | "CM"
    | "CDM" | "LB" | "RB" | "CB" | "GK";

export type Ratings = {
    overall: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
};

export type Player = {
    name: string;
    position: Position;
    ratings: Ratings;
};

interface PlayerListContextType {
    playerList: Player[];
    updatePlayers: (playerList: Player[]) => void;
}

const PlayerListContext = createContext<PlayerListContextType | undefined>(undefined);

export const usePlayerList = () => {
    const context = useContext(PlayerListContext);
    if (!context) {
        throw new Error("usePlayers must be used within a PlayersProvider");
    }
    return context;
};

export const defaultPlayer: Player = {
    name: "Player",
    position: "ST",
    ratings: {
        overall: 0,
        pace: 0,
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defending: 0,
        physicality: 0,
    },
};

export const PlayerListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socket = useSocket();
    const [playerList, setPlayerList] = useState<Player[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "players_list") {
                setPlayerList(data.players);
            }
        };

        socket.addEventListener("message", handleMessage);

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_players" }));
        } else {
            socket.addEventListener("open", () => {
                socket.send(JSON.stringify({ type: "get_players" }));
            }, { once: true });
        }

        return () => socket.removeEventListener("message", handleMessage);
    }, [socket]);

    const updatePlayers = (newPlayers: Player[]) => {
        setPlayerList(newPlayers);
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "update_players", players: newPlayers }));
        }
    };

    return (
        <PlayerListContext.Provider value={{ playerList, updatePlayers }}>
            {children}
        </PlayerListContext.Provider>
    );
};
