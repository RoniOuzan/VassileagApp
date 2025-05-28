import React from 'react';
import { Spin } from 'antd';
import { DisconnectOutlined } from '@ant-design/icons';
import './NoConnection.scss';

const NoConnection: React.FC = () => {
    return (
        <div className="no-connection">
            <Spin indicator={<DisconnectOutlined style={{ fontSize: 36 }} />} />
            <p className="no-connection__message">No connection to the server. Please check your network or try again later.</p>
        </div>
    );
};

export default NoConnection;
