import {  Layout, } from 'antd';
import { Outlet } from 'react-router-dom';

import TreeView from '../components/TreeView';
import TopHeader from '../components/TopHeader';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {


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
          <TreeView />
        </Sider>
        <Layout style={{ padding: '0 0px 0px' }}>
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
