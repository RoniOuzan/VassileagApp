import { Button, Divider, Form, Input, Modal, Typography } from "antd";
import { Game } from "./Games";
import "./Games.scss";

const { Text } = Typography;

interface Props {
    game: Game | null;
    setGame: (game: Game | null) => void;
}

const GamePreview: React.FC<Props> = ({ game, setGame }) => {
    if (!game) return null;

    const renderPlayers = (players: Game["team1"]["players"]) => (
        <div className="games__preview__players">
            {players.map((player, index) => (
                <div key={index} className="games__preview__player">
                    <Text strong>{player.name}</Text>
                    <Text> - Goals: {player.goals}, Assists: {player.assists}</Text>
                </div>
            ))}
        </div>
    );

    return (
        <Modal
            className="games__create-game"
            title={`Game - ${game.date}`}
            open={!!game}
            onCancel={() => setGame(null)}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Date">
                    <Input value={game.date} readOnly />
                </Form.Item>

                <Divider />

                <div className="games__create-game__teams">
                    <div className="games__create-game__team">
                        <Form.Item label="Team 1 - Goals">
                            <Input value={game.team1.goals} readOnly />
                        </Form.Item>
                        <Form.Item label="Players">
                            {renderPlayers(game.team1.players)}
                        </Form.Item>
                    </div>

                    <div className="games__create-game__team">
                        <Form.Item label="Team 2 - Goals">
                            <Input value={game.team2.goals} readOnly />
                        </Form.Item>
                        <Form.Item label="Players">
                            {renderPlayers(game.team2.players)}
                        </Form.Item>
                    </div>
                </div>

                <Button
                    type="primary"
                    onClick={() => setGame(null)}
                    style={{ marginTop: "16px" }}
                >
                    Close
                </Button>
            </Form>
        </Modal>
    );
};

export default GamePreview;
