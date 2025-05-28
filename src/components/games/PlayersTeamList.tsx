import { Form, Input, Space, Select, Button } from "antd";
import { Player, Statistics } from "../players/Players";
import { Game } from "./Games";

interface Props {
    team: "team1" | "team2",
    newGame: Game;
    setNewGame: (game: Game) => void;
    playersList: string[];
    isPlayerNotListed: (player: string) => boolean;
    setPlayingPlayers: (players: Player[]) => void;
}

const PlayersTeamList: React.FC<Props> = ( { team, newGame, setNewGame, playersList, isPlayerNotListed, setPlayingPlayers } ) => {
    const handlePlayerChange = (
        index: number,
        field: keyof Player | keyof Statistics,
        value: string | number
    ) => {
        const updatedPlayers = [...(newGame[team].players as Player[])];

        if (field === "goals" || field === "assists") {
            updatedPlayers[index].statistics = {
                ...updatedPlayers[index].statistics,
                [field]: Number(value),
            };
        } else if (field === "name") {
            updatedPlayers[index].name = value as string;
        }

        setPlayingPlayers(updatedPlayers);
        setNewGame({
            ...newGame,
            [team]: {
                ...newGame[team],
                players: updatedPlayers,
            },
        });
    };

    const handleTeamGoalsChange = (goals: number) => {
        setNewGame({
            ...newGame,
            [team]: {
                ...newGame[team],
                goals,
            },
        });
    };

    const addPlayer = () => {
        const updatedPlayers = [...(newGame[team].players as Player[])];
        updatedPlayers.push({ name: "", statistics: { goals: 0, assists: 0 } });
        setNewGame({
            ...newGame,
            [team]: {
                ...newGame[team],
                players: updatedPlayers,
            },
        });
    };

    const removePlayer = (index: number) => {
        const updatedPlayers = [...(newGame[team].players as Player[])];
        updatedPlayers.splice(index, 1);
        setNewGame({
            ...newGame,
            [team]: {
                ...newGame[team],
                players: updatedPlayers,
            },
        });
    };

    return (
        <div className="games__create-game__team games__create-game__team--left">
            <Form.Item label={`Team ${team.charAt(4)} Goals`}>
                <Input
                    type="number"
                    value={newGame[team].goals}
                    onChange={(e) =>
                        handleTeamGoalsChange(Number(e.target.value))
                    }
                />
            </Form.Item>

            <div>
                <label>Team {team.charAt(4)} Players</label>
                {(newGame[team].players as Player[]).map((player, idx) => (
                    <Space
                        key={`team${team.charAt(4)}-player-${idx}`}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="start"
                    >
                        <Select
                            style={{ width: 150 }}
                            placeholder="Select player"
                            value={player.name || undefined}
                            onChange={(val) =>
                                handlePlayerChange(idx, "name", val)
                            }
                            options={playersList.filter(isPlayerNotListed).map((name) => ({
                                label: name,
                                value: name,
                            }))}
                        />
                        <Input
                            style={{ width: 80 }}
                            type="number"
                            min={0}
                            placeholder="Goals"
                            value={player.statistics.goals}
                            onChange={(e) =>
                                handlePlayerChange(idx, "goals", e.target.value)
                            }
                        />
                        <Input
                            style={{ width: 80 }}
                            type="number"
                            min={0}
                            placeholder="Assists"
                            value={player.statistics.assists}
                            onChange={(e) =>
                                handlePlayerChange(idx, "assists", e.target.value)
                            }
                        />
                        {idx > 0 && (
                            <Button
                                danger
                                type="text"
                                onClick={() => removePlayer(idx)}
                            >
                                Remove
                            </Button>
                        )}
                    </Space>
                ))}
                <Button type="dashed" onClick={() => addPlayer()} block>
                    + Add Player
                </Button>
            </div>
        </div>
    );
}

export default PlayersTeamList;