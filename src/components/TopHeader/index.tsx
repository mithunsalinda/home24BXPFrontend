import React from 'react';
import Logo from '../Logo';
import { Button, Dropdown, Space, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../features/Auth/_LoginSlice';
import { UserOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';

interface TopHeaderProps {
  onToggleSidebar?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, name } = useSelector((state: any) => state.auth.user || {});

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/login');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
<div style={{ display: 'flex', alignItems: 'center' }}>

        {onToggleSidebar && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggleSidebar}
            style={{ fontSize: '18px', marginRight: 16 }}
          />
        )}

        {/* Logo */}
        <Logo size={100} />
      </div>
      <Space>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button icon={<UserOutlined />}>
            {name || email} <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </>
  );
};

export default TopHeader;
