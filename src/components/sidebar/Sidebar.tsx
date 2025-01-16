import { headerHeight } from '../../App';
import './Sidebar.scss'

interface Props {
  
}

const Sidebar: React.FC<Props> = () => {
  return (
    <div className="sidebar" style={{ top: `${headerHeight + 8}px`, height: `calc(100% - ${headerHeight})` }}>
    </div>
  );
}

export default Sidebar;
