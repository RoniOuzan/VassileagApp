import { Select } from "antd";
import "./Statistics.scss";
import { useLeague } from "../../context/LeagueContext";
import { Player } from "../players/Players";
import { useState } from "react";
import PlayerStatistics from "./PlayerStatistics";

interface Props {}

const Statistics: React.FC<Props> = () => {
    const { league } = useLeague();

    if (!league) {
        return <div></div>;
    }

    const [player, setPlayer] = useState<Player | null>(null);

    const players: Player[] = league.players;

    return (
        <div className="statistics">
            <div className="player-select">
                <Select
                    placeholder="Select Player"
                    style={{ width: 500 }}
                    options={players.map((player) => ({
                        label: player.name,
                        value: player.name,
                    }))}
                    onChange={(value) => {
                        const selectedPlayer = players.find(p => p.name === value) || null;
                        setPlayer(selectedPlayer);
                    }}
                />
            </div>
            {player && <PlayerStatistics player={player} />}
        </div>
    );
};

export default Statistics;
