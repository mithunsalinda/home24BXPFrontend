import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Spin } from 'antd';
import { useProductByIdQuery } from './_ProductService'; // You'll need this query
import { ArrowLeftOutlined } from '@ant-design/icons';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useProductByIdQuery(id);
  const navigate = useNavigate();
  if (isLoading) return <Spin size="large" />;
  if (isError) return <p>Failed to load product details.</p>;

  return (
    <>
      <Card title={`Product Details: ${data.name}`}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Go Back
        </Button>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
          <Descriptions.Item label="Category">{data.category}</Descriptions.Item>
          <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
          <Descriptions.Item label="Price">${data.price}</Descriptions.Item>
          <Descriptions.Item label="Last Modified">{data.lastModified}</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default ProductDetail;
