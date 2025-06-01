import { Button, Input, Select, Space } from "antd";
import { Game, PlayedPlayer } from "./Games";
import { Ratings } from "../players/Players";

interface Props {
  team: "team1" | "team2";
  newGame: Game;
  setNewGame: (game: Game) => void;
  playerList: string[];
  isPlayerNotListed: (player: string) => boolean;
  setPlayedPlayers: (players: PlayedPlayer[]) => void;
}

const PlayersTeamList: React.FC<Props> = ({
  team,
  newGame,
  setNewGame,
  playerList: playersList,
  isPlayerNotListed,
  setPlayedPlayers,
}) => {
  const handlePlayerChange = (
    index: number,
    field: keyof PlayedPlayer | keyof Ratings,
    value: string | number
  ) => {
    const updatedPlayers = [...(newGame[team].players as PlayedPlayer[])];

    if (field === "goals" || field === "assists") {
      updatedPlayers[index][field] = Number(value);
    } else if (field === "name") {
      updatedPlayers[index].name = value as string;
    }

    setPlayedPlayers(updatedPlayers);
    setNewGame({
      ...newGame,
      [team]: {
        ...newGame[team],
        players: updatedPlayers,
        goals: updatedPlayers.map((p) => p.goals).reduce((t, c) => t + c, 0), // sum
      },
    });
  };

  const addPlayer = () => {
    const updatedPlayers = [...(newGame[team].players as PlayedPlayer[])];
    updatedPlayers.push({ name: "", goals: 0, assists: 0 });
    setNewGame({
      ...newGame,
      [team]: {
        ...newGame[team],
        players: updatedPlayers,
      },
    });
  };

  const removePlayer = (index: number) => {
    const updatedPlayers = [...(newGame[team].players as PlayedPlayer[])];
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
      <label>Players</label>
      <div>
        <label>Team {team.charAt(4)} Players</label>
        {(newGame[team].players as PlayedPlayer[]).map((player, idx) => (
          <Space
            key={`team${team.charAt(4)}-player-${idx}`}
            style={{ display: "flex", marginBottom: 8 }}
            align="start"
          >
            <Select
              style={{ width: 150 }}
              placeholder="Select player"
              value={player.name || undefined}
              onChange={(val) => handlePlayerChange(idx, "name", val)}
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
              value={player.goals}
              onChange={(e) => handlePlayerChange(idx, "goals", e.target.value)}
            />
            <Input
              style={{ width: 80 }}
              type="number"
              min={0}
              placeholder="Assists"
              value={player.assists}
              onChange={(e) =>
                handlePlayerChange(idx, "assists", e.target.value)
              }
            />
            {idx > 0 && (
              <Button danger type="text" onClick={() => removePlayer(idx)}>
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
};

export default PlayersTeamList;
