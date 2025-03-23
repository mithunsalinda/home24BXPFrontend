import { Layout } from 'antd';
import { Outlet } from 'react-router';

const { Content } = Layout;

const AuthLayout = () => {
  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
