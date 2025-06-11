import { Modal, Form, Input, Button, Divider } from "antd";
import { Game, PlayedPlayer } from "./Games";
import { useCallback, useEffect, useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import PlayersTeamList from "./PlayersTeamList";
import { useLeague } from "../../context/LeagueContext";
import { v4 as uuidv4 } from 'uuid';

const errorMessages = [
    "The date is not valid!",
    "The players of team 1 are not valid!",
    "The players of team 2 are not valid!",
];

interface Props {
    show: boolean;
    setIsCreateGameOpen: (value: boolean) => void;
    newGame: Game;
    setNewGame: (game: Game) => void;
}

const AddGame: React.FC<Props> = ({
    show,
    setIsCreateGameOpen,
    newGame,
    setNewGame,
}) => {
    const { league, updateGame } = useLeague();

    const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
    const [playedPlayers1, setPlayedPlayers1] = useState<PlayedPlayer[]>([]);
    const [playedPlayers2, setPlayedPlayers2] = useState<PlayedPlayer[]>([]);
    const [displayErrors, setDisplayErrors] = useState(false);

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

    const updateErrorMessages = useCallback(() => {
        const conditions = [
            !newGame.date,
            (newGame.team1.players as PlayedPlayer[]).length === 0 ||
                (newGame.team1.players as PlayedPlayer[]).some((p) => !p.name),
            (newGame.team2.players as PlayedPlayer[]).length === 0 ||
                (newGame.team2.players as PlayedPlayer[]).some((p) => !p.name),
        ];
        if (conditions.some((c) => c)) {
            setErrors(conditions);
            return true;
        }
        return false;
    }, [newGame]);

    const handleAddGame = () => {
        setDisplayErrors(true);
        if (updateErrorMessages()) 
            return;
        
        updateGame(newGame);
        setIsCreateGameOpen(false);
        setNewGame({
            id: uuidv4(),
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
    }, [newGame.team1.players, newGame, setNewGame]);

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
    }, [newGame.team2.players, newGame, setNewGame]);

    useEffect(() => {
        updateErrorMessages();
    }, [updateErrorMessages, newGame.date, newGame.team1.players, newGame.team2.players]);
    
    if (!league) {
        return <div/>;
    }
    const playerList = league.players.map(p => p.name);

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
                        onChange={(e) => {
                            handleInputChange("date", e.target.value);
                            updateErrorMessages();
                        }}
                    />
                </Form.Item>

                <Divider />

                <div className="games__create-game__teams">
                    <PlayersTeamList
                        team={"team1"}
                        newGame={newGame}
                        setNewGame={setNewGame}
                        playerList={playerList}
                        isPlayerNotListed={isPlayerNotListed}
                        setPlayedPlayers={setPlayedPlayers1}
                    />
                    <PlayersTeamList
                        team={"team2"}
                        newGame={newGame}
                        setNewGame={setNewGame}
                        playerList={playerList}
                        isPlayerNotListed={isPlayerNotListed}
                        setPlayedPlayers={setPlayedPlayers2}
                    />
                </div>

                {displayErrors && errors
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
