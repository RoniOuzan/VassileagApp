import { FloatButton, Modal, Input, Button, Form } from "antd";
import GameComponent from "./GameComponent";
import "./Games.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export type Game = {
    date: string;
    team1: Team;
    team2: Team;
};

export type Team = {
    goals: number;
    players: string[];
};

const Games: React.FC = () => {
    const [games, setGames] = useState<Game[]>([
        { date: "17/1/2025", team1: { goals: 1, players: ["Player 1", "Player 2"] }, team2: { goals: 2, players: ["Player 3", "Player 4"] } },
        { date: "16/1/2025", team1: { goals: 1, players: ["Player 1", "Player 2"] }, team2: { goals: 0, players: ["Player 3", "Player 4"] } },
    ]);

    const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
    const [newGame, setNewGame] = useState<Game>({
        date: "",
        team1: { goals: 0, players: [""] },
        team2: { goals: 0, players: [""] },
    });

    const handleInputChange = (field: keyof Game, value: string) => {
        setNewGame({ ...newGame, [field]: value });
    };

    const handleTeamChange = (team: "team1" | "team2", field: keyof Team, value: string | number) => {
        setNewGame({
            ...newGame,
            [team]: {
                ...newGame[team],
                [field]: typeof value === "number" ? value : value.split(",").map((p) => p.trim()),
            },
        });
    };

    const handleAddGame = () => {
        if (!newGame.date || newGame.team1.players.length === 0 || newGame.team2.players.length === 0) return;
        setGames([...games, newGame]);
        setIsCreateGameOpen(false);
        setNewGame({ date: "", team1: { goals: 0, players: [""] }, team2: { goals: 0, players: [""] } });
    };

    return (
        <div className="games">
            {games.map((game, index) => (
                <GameComponent key={index} game={game} />
            ))}
            <FloatButton className="games__button" icon={<PlusOutlined />} onClick={() => setIsCreateGameOpen(true)} />

            <Modal
                className="games__create-game"
                title="Create Game"
                open={isCreateGameOpen}
                onCancel={() => setIsCreateGameOpen(false)}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="Date">
                        <Input
                            placeholder="DD/MM/YYYY"
                            value={newGame.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                        />
                    </Form.Item>
                    
                    <div className="games__create-game__teams">
                        <div className="games__create-game__team games__create-game__team--left">
                            <Form.Item label="Team 1 Goals">
                                <Input
                                    type="number"
                                    value={newGame.team1.goals}
                                    onChange={(e) =>
                                        handleTeamChange("team1", "goals", Number(e.target.value))
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Team 1 Players">
                                <Input
                                    placeholder="Player 1, Player 2"
                                    value={newGame.team1.players.join(", ")}
                                    onChange={(e) =>
                                        handleTeamChange("team1", "players", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </div>

                        <div className="games__create-game__team games__create-game__team--right">
                            <Form.Item label="Team 2 Goals">
                                <Input
                                    type="number"
                                    value={newGame.team2.goals}
                                    onChange={(e) =>
                                        handleTeamChange("team2", "goals", Number(e.target.value))
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Team 2 Players">
                                <Input
                                    placeholder="Player 3, Player 4"
                                    value={newGame.team2.players.join(", ")}
                                    onChange={(e) =>
                                        handleTeamChange("team2", "players", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Button type="primary" onClick={handleAddGame}>
                        Add Game
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Games;
