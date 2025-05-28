import { Flex } from "antd";
import { PlayedPlayer } from "./Games";

interface Props {
    players: PlayedPlayer[];
}

const TeamComponent: React.FC<Props> = ({ players }) => {
    return (
        <Flex className="games__game__players__team">
            {players.map(p => 
                <div>{p.name}: {p.goals}G, {p.assists}A</div>
            )}
        </Flex>
    );
}

export default TeamComponent;