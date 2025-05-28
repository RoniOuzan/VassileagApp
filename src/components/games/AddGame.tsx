import { Modal, Form, Input, Button } from "antd";
import { Game } from "./Games";
import { useEffect, useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { Player } from "../players/Players";
import PlayersTeamList from "./PlayersTeamList";

const errorMessages = [
  "The date is not valid!",
  "The players of team 1 are not valid!",
  "The players of team 2 are not valid!",
  "The goals of team 1 is not valid!",
  "The goals of team 2 is not valid!",
];

interface Props {
  show: boolean;
  setIsCreateGameOpen: (value: boolean) => void;
  games: Game[];
  newGame: Game;
  setNewGame: (game: Game) => void;
  updateGames: (games: Game[]) => void;
  playersList: string[]; // List of all possible player names
}

const AddGame: React.FC<Props> = ({
  show,
  setIsCreateGameOpen,
  games,
  newGame,
  setNewGame,
  updateGames,
  playersList,
}) => {
  const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
  const [playingPlayers1, setPlayingPlayers1] = useState<Player[]>([]);
  const [playingPlayers2, setPlayingPlayers2] = useState<Player[]>([]);

  const isPlayerNotListed = (player: string) =>
    !playingPlayers1.some((p) => p.name === player) &&
    !playingPlayers2.some((p) => p.name === player);

  const handleInputChange = (field: keyof Game, value: string) => {
    setNewGame({ ...newGame, [field]: value });
  };

  const handleAddGame = () => {
    const conditions = [
      !newGame.date,
      (newGame.team1.players as Player[]).length === 0 ||
        (newGame.team1.players as Player[]).some((p) => !p.name),
      (newGame.team2.players as Player[]).length === 0 ||
        (newGame.team2.players as Player[]).some((p) => !p.name),
      newGame.team1.goals < 0,
      newGame.team2.goals < 0,
    ];
    if (conditions.some((c) => c)) {
      setErrors(conditions);
      return;
    }
    updateGames([...games, newGame]);
    setIsCreateGameOpen(false);
    setNewGame({
      date: "",
      team1: { goals: 0, players: [] },
      team2: { goals: 0, players: [] },
    });
    setErrors(Array(5).fill(false));
  };

  // Initialize players array if empty
  useEffect(() => {
    if (
      !Array.isArray(newGame.team1.players) ||
      newGame.team1.players.length === 0
    ) {
      setNewGame({
        ...newGame,
        team1: {
          ...newGame.team1,
          players: [{ name: "", statistics: { goals: 0, assists: 0 } }],
        },
      });
    }
  }, [newGame.team1.players, newGame]);

  useEffect(() => {
    if (
      !Array.isArray(newGame.team2.players) ||
      newGame.team2.players.length === 0
    ) {
      setNewGame({
        ...newGame,
        team2: {
          ...newGame.team2,
          players: [{ name: "", statistics: { goals: 0, assists: 0 } }],
        },
      });
    }
  }, [newGame.team2.players, newGame]);

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
          <PlayersTeamList
            team={"team1"}
            newGame={newGame}
            setNewGame={setNewGame}
            playersList={playersList}
            isPlayerNotListed={isPlayerNotListed}
            setPlayingPlayers={setPlayingPlayers1}
          />
          <PlayersTeamList
            team={"team2"}
            newGame={newGame}
            setNewGame={setNewGame}
            playersList={playersList}
            isPlayerNotListed={isPlayerNotListed}
            setPlayingPlayers={setPlayingPlayers2}
          />
        </div>

        {errors
          .map((c, i) => ({ c, i }))
          .filter(({ c }) => c)
          .map(({ i }) => (
            <ErrorMessage key={i} id={i + ""}>
              {errorMessages[i]}
            </ErrorMessage>
          ))}

        <Button
          type="primary"
          onClick={handleAddGame}
          style={{ marginTop: "16px" }}
        >
          Add Game
        </Button>
      </Form>
    </Modal>
  );
};

export default AddGame;
