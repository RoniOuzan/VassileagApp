import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import './App.scss';
import Games from './components/games/Games';
import Players from './components/players/Players.tsx';
import Statistics from './components/statistics/Statistics';
import { useSocket } from './context/SocketContext.tsx';
import NoConnection from './components/other/no_connection/NoConnection.tsx';

export const headerHeight = 64;

const App = () => {
  const socket = useSocket();
  const [collapsed, setCollapsed] = useState(false);
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
    <Layout className='app'>
      <Header className='app__header' style={{ height: headerHeight }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#F5D409" }}
        />
        Header
      </Header>
      <Layout>
        <Sider className='app__sider' trigger={null} collapsible collapsed={collapsed}>
          <Menu
            className='app__sider__tabs'
            defaultSelectedKeys={['games']}
            onClick={({ key }) => setSelectedKey(key)} // Update selectedKey state on menu click
            items={[
              { key: 'games', icon: <UserOutlined />, label: 'Games' },
              { key: 'players', icon: <VideoCameraOutlined />, label: 'Players' },
              { key: 'statistics', icon: <UploadOutlined />, label: 'Statistics' },
            ]}
          />
        </Sider>
        <Layout>
          {renderContent()}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
