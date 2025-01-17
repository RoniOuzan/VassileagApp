import { FloatButton } from "antd";
import GameComponent from "./GameComponent";
import Game from "./GameComponent";
import "./Games.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export type Game = {
    date: string;
    team1: Team;
    team2: Team;
}

export type Team = {
    goals: number;
    players: string[];
}

interface Props {

}

const Games: React.FC<Props> = ({ }) => {
    const [games, setGames] = useState<Game[]>([
        { date: "17/1/2025", team1: {goals: 1, players: ["Player 1", "Player 2"]}, team2: {goals: 2, players: ["Player 1", "Player 2"]} },
        { date: "16/1/2025", team1: {goals: 1, players: ["Player 1", "Player 2", "Player 1", "Player 2"]}, team2: {goals: 0, players: ["Player 1", "Player 2"]} },
    ]);

    const addGame = () => {
        setGames([...games, { date: "16/1/2025", team1: {goals: 1, players: ["Player 1, Player 2"]}, team2: {goals: 0, players: ["Player 1, Player 2"]} }]);
    }

    return (
        <div className="games">
            {games.map((game, index) => <GameComponent key={index} game={game} />)}
            <FloatButton 
                className="games__button" 
                icon={<PlusOutlined />}
                onClick={addGame}
            />
        </div>
    );
}

export default Games;