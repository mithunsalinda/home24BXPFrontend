import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import TreeView from '../components/TreeView';
import TopHeader from '../components/TopHeader';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: '0 16px',
          justifyContent: 'space-between',
        }}
      >
        {/* Pass toggle control to TopHeader */}
        <TopHeader onToggleSidebar={handleToggle} />
      </Header>

      <Layout>
        <Sider
          width={280}
          collapsedWidth={0}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          style={{
            background: '#437cff',
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            position: 'fixed',
            zIndex: 1000,
            left: collapsed ? -280 : 0,
            top: 64,
            transition: 'left 0.3s ease',
          }}
        >
          <TreeView />
        </Sider>

        {/* Main layout area shifts when sidebar is visible */}
        <Layout
          style={{
            marginLeft: collapsed ? 0 : 280,
            transition: 'margin-left 0.3s ease',
            padding: 10,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Content style={{ overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
