import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Carousel, Descriptions, Spin, Row, Col } from 'antd';
import { useProductByIdQuery } from './_ProductService';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Product } from './Products.type';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useProductByIdQuery<Product>(id);
  const navigate = useNavigate();
  if (isLoading) return <Spin size="large" />;
  if (isError) return <p>Failed to load product details.</p>;
  return (
    <Card title={`Product Details: ${data.name}`}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Go Back
      </Button>
      <Row gutter={24}>
        <Col xs={24} md={6}>
          {data?.picture?.length ? (
            <Carousel arrows infinite={false}>
              {data.picture.map((pic: string, index: number) => (
                <div key={index}>
                  <div className="productDetail">
                    <img
                      className="productDetail__image"
                      src={pic}
                      alt={`Product image ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>No images available</div>
          )}
        </Col>
        <Col xs={24} md={18}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
            <Descriptions.Item label="Category">{data.category}</Descriptions.Item>
            <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
            <Descriptions.Item label="Price">${data.price}</Descriptions.Item>
            <Descriptions.Item label="Last Modified">{data.lastModified}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetail;
