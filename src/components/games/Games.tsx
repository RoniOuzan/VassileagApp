import Game from "./Game";
import "./Games.scss";

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

    const games: Game[] = [
        {date: "today", team1: {goals: 1, players: ["P1, P2"]}, team2: {goals: 2, players: ["P1, P2"]}}
    ];

    return (
        <div className="container">
            {Object.keys(games).map(() => {
                return <Game></Game>
            })}
        </div>
    );
}

export default Games;