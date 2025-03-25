import React from 'react';
import Logo from '../Logo';
import { Button, Dropdown, Space, Menu, Avatar } from 'antd';
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

  const menu: any = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', zIndex: 10000 }}>
        {onToggleSidebar && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggleSidebar}
            style={{ fontSize: '18px', marginRight: 16 }}
            //className='mobileOnly'
          />
        )}

        {/* Logo */}
        <Logo size={100} />
      </div>
      <Space>
        <Space wrap size={16}>
          <Avatar size={35} icon={<UserOutlined />} />
        </Space>
        {email} <Button onClick={handleLogout}>Log Out</Button>
        {/* <Dropdown menu={menu} placement="bottomRight" trigger={['click']}>
          <Button icon={<UserOutlined />}>
            {name || email} <DownOutlined />
          </Button>
        </Dropdown> */}
      </Space>
    </>
  );
};

export default TopHeader;
