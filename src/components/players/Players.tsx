import { FloatButton } from "antd";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import AddPlayer from "./AddPlayer";

export const defaultPlayer: Player = {
    name: "Player",
    position: "ST",
    ratings: { overall: 0, pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physicality: 0 },
};

export const ratingTypes = [ "pace", "shooting", "passing", "dribbling", "defending", "physicality" ];
export const positionOptions: Position[] = [ "ST", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK" ];

export type Position = "ST" | "LW" | "RW" | "LM" | "RM" | "CAM" | "CM" | "CDM" | "LB" | "RB" | "CB" | "GK";


export type Player = {
    name: string;
    position: Position;
    ratings: Ratings;
};

export type Ratings = {
    overall: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
};

const Players: React.FC = () => {
    const socket = useSocket();
    
    const [players, setPlayers] = useState<Player[]>([]);

    const [isCreatePlayerOpen, setIsCreatePlayerOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState<Player>(defaultPlayer);

    useEffect(() => {
        if (!socket) return;
    
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "players_list") {
                setPlayers(data.players);
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
    
        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    const updatePlayers = (players: Player[]) => {
        setPlayers(players);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "update_players",
                players: players
            }));
        }
    }

    return (
        <div className="players">
            {players.length == 0 ? 
                <>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "64px"}}>
                        <div style={{ fontSize: "64px" }}>No players have been added yet.</div>
                        <div style={{ fontSize: "48px", color: "#888" }}>Come back later</div>
                    </div>
                </>
            :
                players.map((player, index) => (
                    <PlayerComponent key={index} player={player} />
                ))  
            }
            <FloatButton className="players__button" icon={<PlusOutlined />} onClick={() => setIsCreatePlayerOpen(true)} />

            <AddPlayer 
                show={isCreatePlayerOpen} 
                setIsCreatePlayerOpen={setIsCreatePlayerOpen} 
                players={players} 
                newPlayer={newPlayer} 
                setNewPlayer={setNewPlayer} 
                updatePlayers={updatePlayers}
            />
        </div>
    );
};

export default Players;
