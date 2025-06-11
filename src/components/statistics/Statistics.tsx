import { Select } from "antd";
import "./Statistics.scss";
import { useLeague } from "../../context/LeagueContext";
import { Player } from "../players/Players";
import { useState } from "react";
import PlayerStatistics from "./PlayerStatistics";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import

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

            <AnimatePresence mode="wait">
                {player && (
                    <motion.div
                        key={player.name}
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 200 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflowY: "hidden" }}
                    >
                        <PlayerStatistics player={player} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Statistics;
