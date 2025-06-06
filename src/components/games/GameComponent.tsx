import { Game } from "./Games";
import "./Games.scss";
import TeamComponent from "./TeamComponent";

interface Props {
    game: Game;
    onClick: () => void;
}

const GameComponent: React.FC<Props> = ({ game, onClick }) => {
    return (
        <div className="games__game" onClick={onClick}>
            <div className="games__game__date">
                Date: {game.date}
            </div>
            <div className="games__game__score">
                {game.team1.goals} - {game.team2.goals}
            </div>
            <div className="games__game__players">
                <TeamComponent players={game.team1.players} />
                <TeamComponent players={game.team2.players} />
            </div>
        </div>
    );
}

export default GameComponent;