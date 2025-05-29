import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { defaultLigue, Ligue } from "./Ligues";

const errorMessages = [
    "This ligue's name is not valid!",
    "A ligue with this name is already taken!",
];

interface Props {
    show: boolean;
    ligueList: Ligue[];
    setShow: (value: boolean) => void;
    updateLigues: (ligues: Ligue[]) => void;
}

const AddLigue: React.FC<Props> = ({ show, ligueList, setShow, updateLigues }) => {
    const [errors, setErrors] = useState<boolean[]>(Array(1).fill(false));
    const [newLigue, setNewLigue] = useState<Ligue>(defaultLigue);

    const handleAddLigue = () => {
        const conditions = [
            !newLigue.name,
            ligueList.some(l => l.name.toLowerCase() == newLigue.name.toLowerCase())
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }

        updateLigues([...ligueList, newLigue]);
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
