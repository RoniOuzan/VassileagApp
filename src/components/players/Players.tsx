import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import { useLeague } from "../../context/LeagueContext";
import AddPlayer from "./AddPlayer";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";

export const defaultPlayer: Player = {
    name: "Player",
    position: "ST",
    ratings: {
        overall: 0,
        pace: 0,
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defending: 0,
        physicality: 0,
    },
};

export const ratingTypes = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physicality",
];

export const positionOptions: Position[] = [
  "ST",
  "LW",
  "RW",
  "LM",
  "RM",
  "CAM",
  "CM",
  "CDM",
  "LB",
  "RB",
  "CB",
  "GK",
];

export type Position =
    | "ST" | "LW" | "RW" | "LM" | "RM" | "CAM" | "CM"
    | "CDM" | "LB" | "RB" | "CB" | "GK";

export type Ratings = {
    overall: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
};

export type Player = {
    name: string;
    position: Position;
    ratings: Ratings;
};

const Players: React.FC = () => {
    const { league } = useLeague();

    const [createPlayerMenu, setCreatePlayerMenu] = useState(false);
    const [newPlayer, setNewPlayer] = useState<Player>(defaultPlayer);

    if (!league) {
        return <div />;
    }
    const playerList = league.players;

    return (
        <div className="players">
            {playerList.length === 0 ? (
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
                playerList.map((player, index) => <PlayerComponent key={index} player={player} />)
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
            />
        </div>
    );
};

export default Players;
