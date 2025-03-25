import React from 'react';
import { motion } from 'framer-motion';
import { Card, Col, Layout, Row, Typography } from 'antd';
import Logo from '../components/Logo';
import { LoginForm } from '../features/Auth/LoginForm';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Content>
        <Row style={{ height: '100vh' }}>
          <Col xs={24} md={24} lg={12} className="leftLoginWrapper">
            <Logo size={200} className="mobileView mobileOnly" />
            <div className="loginWrapper">
              <div style={{ marginBottom: 32 }}>
                <Title level={2}>Sign in</Title>
                <Text type="secondary">Please login to continue to your account.</Text>
              </div>

              <LoginForm />
            </div>
          </Col>
          <Col
            className="rightLoginColumn"
            xs={0}
            sm={0}
            md={0}
            lg={12}
            style={{
              background: '#FFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Logo size={300} className="imageBgColor" />
            </motion.div>

            <motion.h1
              style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Welcome to the <br />
              <motion.span
                style={{ color: '#1890ff', display: 'inline-block' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Admin Panel
              </motion.span>
            </motion.h1>

            <motion.p
              style={{ fontSize: '1.1rem', color: '#888' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              Please login with your account
            </motion.p>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
