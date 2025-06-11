import { Button, Input, Select } from "antd";
import React from "react";
import { useLeague } from "../../context/LeagueContext";
import { Player } from "../players/Players";
import "./TeamCreator.scss";

interface Props {
    team: Player[];
    setTeam: (players: Player[]) => void;
    teamNumber: number;
    isPlayerNotListed: (player: Player) => boolean;
}

const TeamCreator: React.FC<Props> = ({ team, setTeam, teamNumber, isPlayerNotListed }) => {
    const { league } = useLeague();

    if (!league) return <div>Loading league...</div>;

    const players: Player[] = league.players;


    const removePlayer = (idx: number) => {
        const updated = [...team];
        updated.splice(idx, 1);
        setTeam(updated);
    };

    const addPlayer = (player: Player) => {
        setTeam([
            ...team,
            player
        ]);
    };

    return (
        <div className="predictions-team-box">
            <div style={{ fontSize: 32 }}><strong>Team {teamNumber}</strong></div>

            <div className="players-list">
                {team.map((player, idx) => (
                    <div key={`team${teamNumber}-player-${idx}`} className="single-player" >
                        <Input
                            style={{ width: "100%" }}
                            value={player.name}
                            onChange={() => {}}
                            readOnly
                        />
                        <Button danger type="text" onClick={() => removePlayer(idx)}>
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            <Select
                style={{ width: "100%" }}
                placeholder="+ Add Player"
                value={null}
                options={players.filter(isPlayerNotListed).map((player) => ({
                    label: player.name,
                    value: player.name,
                }))}
                onChange={(value) => {
                    const selectedPlayer = players.find(p => p.name == value) || null;
                    if (selectedPlayer)
                        addPlayer(selectedPlayer);
                }}
            />
        </div>
    );
};

export default TeamCreator;
