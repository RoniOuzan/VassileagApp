import { ArrowLeftOutlined, BarChartOutlined, ScheduleOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import './App.scss';
import ThemeProvider from './components/color_scheme/ThemeProvider.tsx';
import Games from './components/games/Games';
import Ligues from './components/ligues/Ligues.tsx';
import NoConnection from './components/other/no_connection/NoConnection.tsx';
import Players from './components/players/Players.tsx';
import Statistics from './components/statistics/Statistics';
import { useLigue } from './context/LigueContext.tsx';
import { useSocket } from './context/SocketContext.tsx';

export const headerHeight = 64;

const App = () => {
  const socket = useSocket();
  const { ligue, setLigue } = useLigue();

  const [selectedKey, setSelectedKey] = useState('games');

  const isSocketConnected = socket?.readyState === WebSocket.OPEN;

  const renderContent = () => {
    if (!isSocketConnected) {
      return <NoConnection />;
    }

    switch (selectedKey) {
      case 'games':
        return <Games />;
      case 'players':
        return <Players />;
      case 'statistics':
        return <Statistics />;
      default:
        return <div style={{ padding: '16px', color: '#F5D409' }}>Select a menu item</div>;
    }
  };

  return (
    <ThemeProvider primaryColor={"#F5D409"} >
      <Layout className='app'>
        <Header className='app__header' style={{ height: headerHeight }}>
          {ligue != null && <Button
            type="text"
            size='large'
            icon={<ArrowLeftOutlined/>}
            onClick={() => setLigue(null)}
            style={{ color: "#F5D409" }}
          />}
          Football Managing App {ligue && `- ${ligue?.name}`}
        </Header>
        {ligue == null ? 
          <Ligues/> 
        : 
          <Layout>
            <Sider className='app__sider' trigger={null}>
              <Menu
                className='app__sider__tabs'
                defaultSelectedKeys={['games']}
                onClick={({ key }) => setSelectedKey(key)}
                items={[
                  { key: 'games', icon: <ScheduleOutlined />, label: 'Games' },
                  { key: 'players', icon: <TeamOutlined />, label: 'Players' },
                  { key: 'statistics', icon: <BarChartOutlined />, label: 'Statistics' },
                ]}
              />
            </Sider>
            <Layout>
              {renderContent()}
            </Layout>
          </Layout >}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
