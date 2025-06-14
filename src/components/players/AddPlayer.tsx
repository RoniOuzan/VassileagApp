import { Modal, Form, Input, Button, InputNumber, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { useLeague } from "../../context/LeagueContext";
import { defaultPlayer, Player, positionOptions, Ratings, ratingTypes } from "./Players";

const errorMessages = [
    "The player's name is not valid!",
    "This name is already taken!",
    "The player's overall rating is not valid!",
    "One or more of the player's rating is not valid!",
];

interface Props {
    show: boolean;
    setShow: (value: boolean) => void;
    newPlayer: Player;
    setNewPlayer: (player: Player) => void;
}

const AddPlayer: React.FC<Props> = ({
    show,
    setShow,
    newPlayer,
    setNewPlayer,
}) => {
    const { league, updatePlayer } = useLeague();

    const [errors, setErrors] = useState<boolean[]>(Array(4).fill(false));
    const [displayErrors, setDisplayErrors] = useState(false);

    const isRatingInvalid = (ratings: Ratings) => {
        return (
            ratings.pace < 0 ||
            ratings.shooting < 0 ||
            ratings.passing < 0 ||
            ratings.dribbling < 0 ||
            ratings.defending < 0 ||
            ratings.physicality < 0
        );
    };

    const updateErrorMessages = useCallback(() => {
        const conditions = [
            !newPlayer.name,
            playerList
                .map((p) => p.name)
                .some((n) => n.toLowerCase() == newPlayer.name.toLowerCase()),
            newPlayer.ratings.overall < 0,
            isRatingInvalid(newPlayer.ratings),
        ];
        if (conditions.some((c) => c)) {
            setErrors(conditions);
            return true;
        }
        return false;
    }, [newPlayer]);

    const handleAddPlayer = () => {
        setDisplayErrors(true);
        if (updateErrorMessages()) return;

        updatePlayer(newPlayer);
        setShow(false);
        setNewPlayer({ ...defaultPlayer });
    };

    const updateRating = (key: keyof Player["ratings"], value: number | null) => {
        setNewPlayer({
            ...newPlayer,
            ratings: {
                ...newPlayer.ratings,
                [key]: value !== null ? Number(value) : 0,
            },
        });
    };
    
    useEffect(() => {
        updateErrorMessages();
    }, [
        updateErrorMessages, 
        newPlayer.name, 
        newPlayer.position, 
        ...ratingTypes.map((key) => newPlayer.ratings[key as keyof typeof newPlayer.ratings])
    ]);

    if (!league) {
        return <div />;
    }
    const playerList = league.players;

    return (
        <Modal
            className="players__create-player"
            title="Create Player"
            open={show}
            onCancel={() => setShow(false)}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Name">
                    <Input
                        placeholder="Name"
                        value={newPlayer.name}
                        onChange={(e) =>
                            setNewPlayer({ ...newPlayer, name: e.target.value })
                        }
                    />
                </Form.Item>

                <Form.Item label="Position">
                    <Select
                        value={newPlayer.position}
                        onChange={(value) =>
                            setNewPlayer({ ...newPlayer, position: value })
                        }
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
                        value={newPlayer.ratings.overall}
                        onChange={(value) => updateRating("overall", value)}
                        min={0}
                        max={99}
                    />
                </Form.Item>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {ratingTypes.map((key) => (
                        <Form.Item
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            key={key}
                            style={{ flex: "1 1 30%" }}
                        >
                            <InputNumber
                                placeholder={key}
                                value={newPlayer.ratings[key as keyof Player["ratings"]]}
                                onChange={(value) =>
                                    updateRating(key as keyof Player["ratings"], value)
                                }
                                style={{ width: "100%" }}
                                max={99}
                                min={0}
                            />
                        </Form.Item>
                    ))}
                </div>

                {displayErrors && errors
                    .map((c, i) => ({ c, i }))
                    .filter(({ c }) => c)
                    .map(({ i }) => (
                        <ErrorMessage key={i} id={i + ""}>
                            {errorMessages[i]}
                        </ErrorMessage>
                    ))}
                <Button type="primary" onClick={handleAddPlayer}>
                    Add Player
                </Button>
            </Form>
        </Modal>
    );
};

export default AddPlayer;
