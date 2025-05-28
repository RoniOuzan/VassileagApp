import { FloatButton } from "antd";
import PlayerComponent from "./PlayerComponent";
import "./Players.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import AddPlayer from "./AddPlayer";

export let players: Player[] = [];

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
  | "ST"
  | "LW"
  | "RW"
  | "LM"
  | "RM"
  | "CAM"
  | "CM"
  | "CDM"
  | "LB"
  | "RB"
  | "CB"
  | "GK";

export type Player = {
  name: string;
  position: Position;
  ratings: Ratings;
};

export type Ratings = {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
};

const Players: React.FC = () => {
  const socket = useSocket();

  const [hasPlayers, setHasPlayers] = useState(false);

  const [createPlayerMenu, setCreatePlayerMenu] = useState<boolean>(false);
  const [newPlayer, setNewPlayer] = useState<Player>(defaultPlayer);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "players_list") {
        players = data.players;
        setHasPlayers(true);
      }
    };

    socket.addEventListener("message", handleMessage);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "get_players" }));
    } else {
      socket.addEventListener(
        "open",
        () => {
          socket.send(JSON.stringify({ type: "get_players" }));
        },
        { once: true }
      );
    }

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const setPlayer = (player: Player) => {
    const updatedPlayers = [...players];
    const index = updatedPlayers.findIndex((p) => p.name === player.name);

    if (index !== -1) {
      updatedPlayers[index] = player;
    }

    updatePlayers(updatedPlayers);
  };

  const updatePlayers = (p: Player[]) => {
    players = p;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "update_players",
          players: p,
        })
      );
    }
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
      ) : players.length === 0 ? (
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
        players.map((_player, index) => (
          <PlayerComponent key={index} index={index} setPlayer={setPlayer} />
        ))
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
