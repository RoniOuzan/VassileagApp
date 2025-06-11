import { useState } from "react";
import { Player } from "../players/Players";
import "./Predictions.scss";
import TeamCreator from "./TeamCreator";

const Predictions = () => {

    const [team1, setTeam1] = useState<Player[]>([]);
    const [team2, setTeam2] = useState<Player[]>([]);

    const isPlayerNotListed = (player: Player) =>
        !team1.some((p) => p.name === player.name) &&
        !team2.some((p) => p.name === player.name);

    return (
        <div className="predictions">
            <div style={{ fontSize: 48, margin: 8 }}><strong>🔮Match Predictions</strong></div>

            <div className="teams-creation">
                <TeamCreator team={team1} setTeam={setTeam1} teamNumber={1} isPlayerNotListed={isPlayerNotListed}/>
                <TeamCreator team={team2} setTeam={setTeam2} teamNumber={2} isPlayerNotListed={isPlayerNotListed}/>
            </div>

            <div className="results">
                <div style={{ fontSize: 40 }}><strong>Predictions</strong></div>
                {(team1.length > 0 && team2.length > 0) && (
                    <div>
                        
                    </div>
                )}
            </div>
        </div>
    );
}

export default Predictions;