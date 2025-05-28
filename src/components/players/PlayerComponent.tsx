import { Player } from "./Players";
import "./Players.scss";

interface Props {
    player: Player;
}

const PlayerComponent: React.FC<Props> = ({ player }) => {
    return (
        <div className="fifa-card">
            <div className="fifa-card__top">
                <div className="fifa-card__overall">{player.ratings.overall}</div>
                <div className="fifa-card__position">{player.position}</div>
            </div>
            <div className="fifa-card__name">{player.name}</div>
            
            <div className="fifa-card__stats">
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">PAC</div>
                <div className="fifa-card__stat-value">{player.ratings.pace}</div>
            </div>
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">SHO</div>
                <div className="fifa-card__stat-value">{player.ratings.shooting}</div>
            </div>
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">PAS</div>
                <div className="fifa-card__stat-value">{player.ratings.passing}</div>
            </div>
        </div>
        <div className="fifa-card__stats">
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">DRI</div>
                <div className="fifa-card__stat-value">{player.ratings.dribbling}</div>
            </div>
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">DEF</div>
                <div className="fifa-card__stat-value">{player.ratings.defending}</div>
            </div>
            <div className="fifa-card__stat">
                <div className="fifa-card__stat-label">PHY</div>
                <div className="fifa-card__stat-value">{player.ratings.physicality}</div>
            </div>
        </div>


        </div>
    );
};

export default PlayerComponent;
