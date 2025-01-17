import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import './App.scss';
import Games from './components/games/Games';
import Players from './components/Players';
import Statistics from './components/Statistics';

export const headerHeight = 48;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // State to track the selected menu item

  const renderContent = () => {
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
            defaultSelectedKeys={['1']}
            onClick={({ key }) => setSelectedKey(key)} // Update selectedKey state on menu click
            items={[
              {
                key: 'games',
                icon: <UserOutlined />,
                label: 'Games',
              },
              {
                key: 'players',
                icon: <VideoCameraOutlined />,
                label: 'Players',
              },
              {
                key: 'statistics',
                icon: <UploadOutlined />,
                label: 'Statistics',
              },
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
