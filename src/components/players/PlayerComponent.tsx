import { Player } from "./Players";
import "./Players.scss";

interface Props {
    player: Player;
}

const PlayerComponent: React.FC<Props> = ({ player }) => {
    return (
        <div className="players__player">
            <div className="players__player__name">
                Name: {player.name}
            </div>
            <div className="players__player__statistics">
                {player.statistics.goals} / {player.statistics.assists}
            </div>
        </div>
    );
}

export default PlayerComponent;