import { useAnimationOrigin } from "../../context/AnimationOriginContext";
import { Ligue } from "../../context/LigueContext";
import "./Ligues.scss";

interface Props {
    ligue: Ligue;
    onClick: () => void;
}

const LigueComponent: React.FC<Props> = ({ ligue, onClick }) => {
    const { setAnimationOrigin } = useAnimationOrigin();

    return (
        <div
            className="ligue-component"
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                setAnimationOrigin({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });

                onClick();
            }}
        >
            {ligue.name}
        </div>
    );
};

export default LigueComponent;
