import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import AddGame from "./AddGame";
import GameComponent from "./GameComponent";
import "./Games.scss";
import GamePreview from "./GamePreview";
import { useLeague } from "../../context/LeagueContext";
import { v4 as uuidv4 } from 'uuid';

export type PlayedPlayer = {
  name: string;
  goals: number;
  assists: number;
};

export type Game = {
  id: string;
  date: string;
  team1: Team;
  team2: Team;
};

export type Team = {
  goals: number;
  players: PlayedPlayer[];
};

const Games: React.FC = () => {
  const { league } = useLeague();

  if (!league) {
    return <div/>;
  }

  const games = league.games;
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [newGame, setNewGame] = useState<Game>({
    id: uuidv4(),
    date: "",
    team1: { goals: 0, players: [{ name: "", goals: 0, assists: 0 }] },
    team2: { goals: 0, players: [{ name: "", goals: 0, assists: 0 }] },
  });
  const [previewGame, setPreviewGame] = useState<Game | null>(null);

  return (
    <div className="games">
      {games.length == 0 ? (
        <>
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
            <div style={{ fontSize: "64px" }}>No game has happened yet.</div>
            <div style={{ fontSize: "48px", color: "#888" }}>
              Come back later
            </div>
          </div>
        </>
      ) : (
        games.map((game, index) => <GameComponent key={index} game={game} onClick={() => setPreviewGame(game)} />)
      )}
      <FloatButton
        className="games__button"
        icon={<PlusOutlined />}
        onClick={() => setIsCreateGameOpen(true)}
      />

      <AddGame
        show={isCreateGameOpen}
        setIsCreateGameOpen={setIsCreateGameOpen}
        newGame={newGame}
        setNewGame={setNewGame}
      />
      <GamePreview 
        game={previewGame}
        setGame={setPreviewGame}
      />
    </div>
  );
};

export default Games;