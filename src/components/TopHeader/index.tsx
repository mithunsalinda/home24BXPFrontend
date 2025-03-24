import React from 'react';
import Logo from '../Logo';
import { Button, Dropdown, Space, Menu, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../features/Auth/_LoginSlice';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

const TopHeader: React.FC = () => {
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
      <Logo size={100} />
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
