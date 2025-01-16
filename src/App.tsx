import './App.scss'
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

export const headerHeight = 48;

const App = () => {
  return (
    <div className="app">
      <Header></Header>
      <Sidebar></Sidebar>
    </div>
  );
}

export default App;
