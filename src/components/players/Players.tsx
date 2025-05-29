import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import {
    defaultPlayer,
    Player,
    usePlayerList,
} from "../../context/PlayerListContext";
import AddPlayer from "./AddPlayer";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";

const Players: React.FC = () => {
    const { playerList, updatePlayers } = usePlayerList();

    const [hasPlayers, setHasPlayers] = useState(false);
    const [createPlayerMenu, setCreatePlayerMenu] = useState(false);
    const [newPlayer, setNewPlayer] = useState<Player>(defaultPlayer);

    useEffect(() => {
        setHasPlayers(playerList.length > 0);
    }, [playerList]);

    const setPlayer = (player: Player) => {
        if (Object.values(player.ratings).every((val) => val === -1)) {
            updatePlayers(
                playerList.filter(
                    (p) => p.name.toLowerCase() !== player.name.toLowerCase()
                )
            );
            return;
        }

        const updatedPlayers = [...playerList];
        const index = updatedPlayers.findIndex((p) => p.name === player.name);

        if (index !== -1) {
            updatedPlayers[index] = player;
        } else {
            updatedPlayers.push(player);
        }

        updatePlayers(updatedPlayers);
    };

    return (
        <div className="players">
            {!hasPlayers ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "48px",
                        color: "#aaa",
                    }}
                >
                    <div>Loading players...</div>
                </div>
            ) : playerList.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "64px",
                    }}
                >
                    <div style={{ fontSize: "64px" }}>
                        No players have been added yet.
                    </div>
                    <div style={{ fontSize: "48px", color: "#888" }}>Come back later</div>
                </div>
            ) : (
                playerList.map((player, index) => {
                    console.log(player);
                    
                    return <PlayerComponent key={index} player={player} setPlayer={setPlayer} />;
                })
            )}

            <FloatButton
                className="players__button"
                icon={<PlusOutlined />}
                onClick={() => setCreatePlayerMenu(true)}
            />

            <AddPlayer
                show={createPlayerMenu}
                setShow={setCreatePlayerMenu}
                newPlayer={newPlayer}
                setNewPlayer={setNewPlayer}
                updatePlayers={updatePlayers}
            />
        </div>
    );
};

export default Players;
