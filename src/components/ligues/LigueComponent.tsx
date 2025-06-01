import { Ligue } from "../../context/LigueContext";
import "./Ligues.scss";

interface Props {
    ligue: Ligue;
    onClick: () => void;
}

const LigueComponent: React.FC<Props> = ({ ligue, onClick }) => {
    return (
        <div className="ligue-component" onClick={onClick}>
            {ligue.name}
        </div>
    );
};

export default LigueComponent;
