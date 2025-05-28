import { Modal, Form, Input, Button } from "antd";
import { Game, Team } from "./Games";
import { useState } from "react";
import ErrorMessage from "../other/ErrorMessage";

const errorMessages = [
    "The date is not valid!",
    "The players of team 1 is not valid!",
    "The players of team 2 is not valid!",
    "The goals of team 1 is not valid!",
    "The goals of team 2 is not valid!"
];

interface Props {
    show: boolean;
    setIsCreateGameOpen: (value: boolean) => void;
    games: Game[];
    newGame: Game;
    setNewGame: (game: Game) => void;
    updateGames: (games: Game[]) => void;
}

const AddGame: React.FC<Props> = ({ show, setIsCreateGameOpen, games, newGame, setNewGame, updateGames }) => {
    const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
    
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
        const conditions = [
            !newGame.date,
            newGame.team1.players.length === 0, // TODO: fix
            newGame.team2.players.length === 0, // TODO: fix
            newGame.team1.goals < 0,
            newGame.team2.goals < 0
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }
        updateGames([...games, newGame]);
        setIsCreateGameOpen(false);
        setNewGame({ date: "", team1: { goals: 0, players: [""] }, team2: { goals: 0, players: [""] } });
    };
    
    return (
        <Modal
            className="games__create-game"
            title="Create Game"
            open={show}
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

                {errors.filter(c => c).map((e, i) => {
                    console.log(i + " " + e);
                    
                    return <ErrorMessage id={i + ""}>
                        {errorMessages[i]}
                    </ErrorMessage>;
                })}
                <Button type="primary" onClick={handleAddGame}>
                    Add Game
                </Button>
            </Form>
        </Modal>
    );
}

export default AddGame;