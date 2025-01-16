import { headerHeight } from '../../App';
import './Header.scss'

interface Props {
  
}

const Header: React.FC<Props> = () => {
  return (
    <div className="header" style={{height: `${headerHeight}px`}}>
      VassileagApp
    </div>
  );
}

export default Header;
