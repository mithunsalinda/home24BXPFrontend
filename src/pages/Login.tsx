import { Col, Image, Layout, Row } from 'antd';
import React from 'react';
import { Images } from '../assets/images/index'
import Logo from '../components/Logo';
const Login: React.FC = () => {
  return (
    <Layout>
      <Row>
        <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>Login</h1>
            </div>
            
        </Col>
        <Col span={12} className="login-container-right">
          <div className="login-content">
            <Logo size={300} className='imageBgColor'/>
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