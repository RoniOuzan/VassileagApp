import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { defaultLigue, Ligue, useLigue } from "../../context/LigueContext";

const errorMessages = [
    "This ligue's name is not valid!",
    "A ligue with this name is already taken!",
];

interface Props {
    show: boolean;
    setShow: (value: boolean) => void;
}

const AddLigue: React.FC<Props> = ({ show, setShow }) => {
    const { ligues, updateLigues } = useLigue();

    const [errors, setErrors] = useState<boolean[]>(Array(2).fill(false));
    const [newLigue, setNewLigue] = useState<Ligue>(defaultLigue);

    const handleAddLigue = () => {
        const conditions = [
            !newLigue.name,
            ligues.some(l => l.name.toLowerCase() == newLigue.name.toLowerCase())
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }

        updateLigues([...ligues, newLigue]);
        setShow(false);
        setNewLigue(defaultLigue);
    };

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
                        value={newLigue.name}
                        onChange={(e) => setNewLigue({ ...newLigue, name: e.target.value })}
                    />
                </Form.Item>

                {errors
                    .map((c, i) => ({ c, i }))
                    .filter(({ c }) => c)
                    .map(({ i }) => (
                        <ErrorMessage key={i} id={i + ""}>
                            {errorMessages[i]}
                        </ErrorMessage>
                    ))}
                <Button type="primary" onClick={handleAddLigue}>
                    Add Ligue
                </Button>
            </Form>
        </Modal>
    );
};

export default AddLigue;
