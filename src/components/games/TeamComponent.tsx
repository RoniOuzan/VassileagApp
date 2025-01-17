import { Flex } from "antd";

interface Props {
    players: string[];
}

const TeamComponent: React.FC<Props> = ({ players }) => {
    return (
        <Flex className="games__game__players__team">
            {players.join(", ")}
        </Flex>
    );
}

export default TeamComponent;