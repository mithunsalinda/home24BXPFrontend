import { Breadcrumb, Button, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../features/Auth/_LoginSlice';
import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import TreeView from '../components/TreeView';
import TopHeader from '../components/TopHeader';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [navFill, setNavFill] = useState(false);

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
          justifyContent: 'space-between',
        }}
      >
        <TopHeader />
      </Header>
      <Layout>
        <Sider width={280} style={{ background: '#437cff', height: '91vh', overflow: 'auto' }}>
          {/* <Menu
            style={{ backgroundColor: '#437cff' }}
            mode="inline"
            onClick={({ key }) => navigate(key)}
            items={[
              { key: '/dashboard', label: 'Dashboard' },
              { key: 'logout', label: 'Logout', onClick: handleLogout },
            ]}
            
          /> */}

          <TreeView />
        </Sider>
        <Layout style={{ padding: '0 0px 0px' }}>
          {/* <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          /> */}
          <Content
            style={{
              padding: 10,
              margin: 0,
              minHeight: 280,
              height: 100,
              overflow: 'auto',
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
