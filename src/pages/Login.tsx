import { Col, Layout, Row } from 'antd';
import React from 'react';
import Logo from '../components/Logo';
import { LoginForm } from '../features/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <Layout>
      <Row>
        <Col span={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <LoginForm />
          </div>
        </Col>
        <Col span={12} className="login-container-right">
          <div className="login-content">
            <Logo size={300} className="imageBgColor" />
            <h1 className="login-title">
              Welcome to the <br />
              <span className="login-title-span">Admin Panel</span>
            </h1>
            <p className="login-subtitle">Please login with your account</p>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Login;
