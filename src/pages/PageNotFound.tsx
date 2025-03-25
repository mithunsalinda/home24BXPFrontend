import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { FrownOutlined } from '@ant-design/icons';

const PageNotFound = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        icon={<FrownOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />}
        status="404"
        title="404 - Page Not Found"
        subTitle="Sorry, the page you are looking for doesn't exist or has been moved."
        extra={
          <Link to="/dashboard">
            <Button type="primary" size="large">
              Go to Dashboard
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default PageNotFound;
