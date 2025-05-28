import { Modal, Form, Input, Button, InputNumber } from "antd";
import { useState } from "react";
import { Player } from "./Players";
import ErrorMessage from "../other/ErrorMessage";

const errorMessages = [
    "The player's name is not valid!",
    "The player's goals amount is not valid!",
    "The player's assists amount is not valid!",
];

interface Props {
    show: boolean;
    setIsCreatePlayerOpen: (value: boolean) => void;
    players: Player[];
    newPlayer: Player;
    setNewPlayer: (player: Player) => void;
    updatePlayers: (players: Player[]) => void;
}

const AddPlayer: React.FC<Props> = ({ show, setIsCreatePlayerOpen, players, newPlayer, setNewPlayer, updatePlayers }) => {
    const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
    
    const handleAddPlayer = () => {
        const conditions = [
            !newPlayer.name,
            newPlayer.statistics.goals < 0,
            newPlayer.statistics.assists < 0
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }

        updatePlayers([...players, newPlayer]);
        setIsCreatePlayerOpen(false);
        setNewPlayer({ name: "", statistics: { goals: 0, assists: 0 } });
    };

    return (
        <Modal
            className="players__create-player"
            title="Create Player"
            open={show}
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

                {errors.filter(c => c).map((e, i) => {
                    console.log(i + " " + e);
                    
                    return <ErrorMessage id={i + ""}>
                        {errorMessages[i]}
                    </ErrorMessage>;
                })}
                <Button type="primary" onClick={handleAddPlayer}>
                    Add Player
                </Button>
            </Form>
        </Modal>
    );
}

export default AddPlayer;