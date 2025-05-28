import { FloatButton } from "antd";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import AddPlayer from "./AddPlayer";

export type Player = {
    name: string;
    statistics: Statistics;
};

export type Statistics = {
    goals: number;
    assists: number;
};

const Players: React.FC = () => {
    const socket = useSocket();
    
    const [players, setPlayers] = useState<Player[]>([]);

    const [isCreatePlayerOpen, setIsCreatePlayerOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState<Player>({
        name: "Player",
        statistics: { goals: 0, assists: 0 },
    });

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
