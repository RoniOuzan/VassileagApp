import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import ErrorMessage from "../other/ErrorMessage";
import { defaultLeague, League, useLeague } from "../../context/LeagueContext";

const errorMessages = [
    "This league's name is not valid!",
    "A league with this name is already taken!",
];

interface Props {
    show: boolean;
    setShow: (value: boolean) => void;
}

const AddLeague: React.FC<Props> = ({ show, setShow }) => {
    const { leagues, updateLeagues } = useLeague();

    const [errors, setErrors] = useState<boolean[]>(Array(2).fill(false));
    const [newLeague, setNewLeague] = useState<League>(defaultLeague);

    const handleAddLeague = () => {
        const conditions = [
            !newLeague.name,
            leagues.some(l => l.name.toLowerCase() == newLeague.name.toLowerCase())
        ];
        if (conditions.some(c => c)) {
            setErrors(conditions);
            return;
        }

        updateLeagues([...leagues, newLeague]);
        setShow(false);
        setNewLeague(defaultLeague);
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
                        value={newLeague.name}
                        onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
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
                <Button type="primary" onClick={handleAddLeague}>
                    Add League
                </Button>
            </Form>
        </Modal>
    );
};

export default AddLeague;
