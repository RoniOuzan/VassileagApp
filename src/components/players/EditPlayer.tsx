import { Button, Form, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { Player, positionOptions, Ratings, ratingTypes } from "./Players";

export type MenuState = "create" | "edit" | "close";

const errorMessages = [
    "The player's name is not valid!",
    "The player's overall rating is not valid!",
    "One or more of the player's rating is not valid!",
];

interface Props {
    menuState: boolean;
    setMenuState: (value: boolean) => void;
    player: Player;
    setPlayer: (player: Player) => void;
}

const EditPlayer: React.FC<Props> = ({ menuState, setMenuState, player, setPlayer }) => {
    const [errors, setErrors] = useState<boolean[]>(Array(4).fill(false));
    const [editingPlayer, setEditingPlayer] = useState<Player>(player);
    
    const isRatingInvalid = (ratings: Ratings) => {
        return ratings.pace < 0 || ratings.shooting < 0 || ratings.passing < 0 || 
            ratings.dribbling < 0 || ratings.defending < 0 || ratings.physicality < 0;
    }

    const handleEditPlayer = () => {
        const conditions = [
            !editingPlayer.name,
            editingPlayer.ratings.overall < 0,
            isRatingInvalid(editingPlayer.ratings),
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }

        setPlayer(editingPlayer);
        setMenuState(false);
    };

    const handleDeletePlayer = () => {
        setPlayer({...player, ratings: {
            overall: -1,
            pace: -1,
            shooting: -1,
            passing: -1,
            dribbling: -1,
            defending: -1,
            physicality: -1
        }});
        setMenuState(false);
    }

    const updateRating = (key: keyof Player["ratings"], value: number | null) => {
        setEditingPlayer({
            ...editingPlayer,
            ratings: {
                ...editingPlayer.ratings,
                [key]: value !== null ? Number(value) : 0
            }
        });
    };

    return (
        <Modal
            className="players__create-player"
            title={"Edit Player - " + player.name} 
            open={menuState}
            onCancel={() => setMenuState(false)}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Position">
                    <Select
                        value={editingPlayer.position}
                        onChange={(value) => setEditingPlayer({ ...editingPlayer, position: value })}
                        placeholder="Select position"
                    >
                        {positionOptions.map((pos) => (
                            <Select.Option key={pos} value={pos}>
                                {pos}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Overall Rating">
                    <InputNumber
                        style={{ width: "100%", fontSize: "24px", fontWeight: "bold" }}
                        placeholder="Overall"
                        value={editingPlayer.ratings.overall}
                        onChange={(value) => updateRating("overall", value)}
                    />
                </Form.Item>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {ratingTypes.map((key) => (
                        <Form.Item label={key.charAt(0).toUpperCase() + key.slice(1)} key={key} style={{ flex: "1 1 30%" }}>
                            <InputNumber
                                placeholder={key}
                                value={editingPlayer.ratings[key as keyof Player["ratings"]]}
                                onChange={(value) => updateRating(key as keyof Player["ratings"], value)}
                                style={{ width: "100%" }}
                                max={99}
                                min={0}
                            />
                        </Form.Item>
                    ))}
                </div>

                {errors
                    .map((c, i) => ({ c, i }))
                    .filter(({ c }) => c)
                    .map(({ i }) => (
                        <ErrorMessage key={i} id={i + ""}>
                            {errorMessages[i]}
                        </ErrorMessage>
                    ))}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type="primary" onClick={handleEditPlayer}>
                        Done
                    </Button>
                    <Button danger type="default" onClick={handleDeletePlayer}>
                        Delete
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditPlayer;
