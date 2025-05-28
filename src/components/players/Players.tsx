import { FloatButton, Modal, Input, Button, Form, InputNumber } from "antd";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";

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

    const handleAddPlayer = () => {
        if (!newPlayer.name) return;

        updatePlayers([...players, newPlayer]);
        setIsCreatePlayerOpen(false);
        setNewPlayer({ name: "", statistics: { goals: 0, assists: 0 } });
    };

    return (
        <div className="players">
            {players.map((player, index) => (
                <PlayerComponent key={index} player={player} />
            ))}
            <FloatButton className="players__button" icon={<PlusOutlined />} onClick={() => setIsCreatePlayerOpen(true)} />

            <Modal
                className="players__create-player"
                title="Create Player"
                open={isCreatePlayerOpen}
                onCancel={() => setIsCreatePlayerOpen(false)}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="Name">
                        <Input
                            placeholder="Name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label="Goals">
                        <InputNumber
                            placeholder="Goals"
                            value={newPlayer.statistics.goals}
                            onChange={(value) => setNewPlayer({
                                ...newPlayer,
                                statistics: { 
                                    goals: value !== null ? Number(value) : 0,
                                    assists: newPlayer.statistics.assists,
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item label="Assists">
                        <InputNumber
                            placeholder="Assists"
                            value={newPlayer.statistics.assists}
                            onChange={(value) => setNewPlayer({
                                ...newPlayer,
                                statistics: { 
                                    goals: newPlayer.statistics.assists,
                                    assists: value !== null ? Number(value) : 0,
                                }
                            })}
                        />
                    </Form.Item>

                    <Button type="primary" onClick={handleAddPlayer}>
                        Add Player
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Players;
