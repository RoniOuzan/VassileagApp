import { useAnimationOrigin } from "../../context/AnimationOriginContext";
import { League } from "../../context/LeagueContext";
import "./Leagues.scss";

interface Props {
    league: League;
    onClick: () => void;
}

const LeagueComponent: React.FC<Props> = ({ league, onClick }) => {
    const { setAnimationOrigin } = useAnimationOrigin();

    return (
        <div
            className="league-component"
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                setAnimationOrigin({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });

                onClick();
            }}
        >
            {league.name}
        </div>
    );
};

export default LeagueComponent;
