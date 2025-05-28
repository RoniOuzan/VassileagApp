import { Modal, Form, Input, Button, Divider } from "antd";
import { Game, PlayedPlayer } from "./Games";
import { useEffect, useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import PlayersTeamList from "./PlayersTeamList";

const errorMessages = [
    "The date is not valid!",
    "The players of team 1 are not valid!",
    "The players of team 2 are not valid!",
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
    const [playedPlayers1, setPlayedPlayers1] = useState<PlayedPlayer[]>([]);
    const [playedPlayers2, setPlayedPlayers2] = useState<PlayedPlayer[]>([]);

    const resetPlayedPlayers = () => {
        setPlayedPlayers1([]);
        setPlayedPlayers2([]);
    };

    const isPlayerNotListed = (player: string) =>
        !playedPlayers1.some((p) => p.name === player) &&
        !playedPlayers2.some((p) => p.name === player);

    const handleInputChange = (field: keyof Game, value: string) => {
        setNewGame({ ...newGame, [field]: value });
    };

    const handleAddGame = () => {
        const conditions = [
            !newGame.date,
            (newGame.team1.players as PlayedPlayer[]).length === 0 ||
                (newGame.team1.players as PlayedPlayer[]).some((p) => !p.name),
            (newGame.team2.players as PlayedPlayer[]).length === 0 ||
                (newGame.team2.players as PlayedPlayer[]).some((p) => !p.name),
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

    useEffect(() => {
        if (show) {
                resetPlayedPlayers();
        }
    }, [show]);

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
                    players: [{ name: "", goals: 0, assists: 0 }],
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
                    players: [{ name: "", goals: 0, assists: 0 }],
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

                <Divider />

                <div className="games__create-game__teams">
                    <PlayersTeamList
                        team={"team1"}
                        newGame={newGame}
                        setNewGame={setNewGame}
                        playersList={playersList}
                        isPlayerNotListed={isPlayerNotListed}
                        setPlayedPlayers={setPlayedPlayers1}
                    />
                    <PlayersTeamList
                        team={"team2"}
                        newGame={newGame}
                        setNewGame={setNewGame}
                        playersList={playersList}
                        isPlayerNotListed={isPlayerNotListed}
                        setPlayedPlayers={setPlayedPlayers2}
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
