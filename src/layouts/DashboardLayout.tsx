import { Breadcrumb, Button, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../features/Auth/_LoginSlice';
import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import TreeView from '../components/TreeView';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [navFill, setNavFill] = useState(false);
  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/login');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        setNavFill(true);
      } else {
        setNavFill(false);
      }
    });
  }, []);

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          verticalAlign: 'middle',
          backgroundColor: '#FFF',
        }}
      >
        <Logo size={100} />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#437cff', height: '100vh' }}>
          {/* <Menu
            style={{ backgroundColor: '#437cff' }}
            mode="inline"
            onClick={({ key }) => navigate(key)}
            items={[
              { key: '/dashboard', label: 'Dashboard' },
              { key: 'logout', label: 'Logout', onClick: handleLogout },
            ]}
            
          /> */}
          <Button onClick={handleLogout}>Log out</Button>
          <TreeView />
        </Sider>
        <Layout style={{ padding: '0 0px 24px' }}>
          {/* <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          /> */}
          <Content
            style={{
              padding: 10,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
