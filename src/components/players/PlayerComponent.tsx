import { useState } from "react";
import EditPlayer from "./EditPlayer";
import { Player, players } from "./Players";
import "./Players.scss";

interface Props {
    index: number;
    setPlayer: (player: Player) => void;
}

const PlayerComponent: React.FC<Props> = ({ index, setPlayer }) => {
    const [editedPlayer, setEditedPlayer] = useState<Player | null>(null);

    const player = players[index];

    return (
        <div>
            <div className="fifa-card" onClick={() => setEditedPlayer(player)}>
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

            {editedPlayer && 
                <EditPlayer 
                    menuState={editedPlayer != null} 
                    setMenuState={(value) => !value && setEditedPlayer(null)} 
                    player={player} 
                    setPlayer={setPlayer} 
                /> 
            }
        </div>
    );
};

export default PlayerComponent;
