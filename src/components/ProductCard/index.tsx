import React from 'react';
import { Card, Tag } from 'antd';
import { FileSearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatUSD, truncateText } from '../../util/formatter';

const { Meta } = Card;

interface Product {
  picture?: string[];
  description: string;
  price: number;
  name: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasValidImage =
    product.picture && product.picture.length > 0 && product.picture[0].startsWith('data:image');

  return (
    <Card
      className="productCard"
      cover={
        hasValidImage ? (
          <img
            alt="Product"
            src={product.picture![0]}
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              fontSize: 16,
              color: '#999',
            }}
          >
            No Image
          </div>
        )
      }
      actions={[
        <FileSearchOutlined key="view" />,
        <EditOutlined key="edit" />,
        <DeleteOutlined key="delete" />,
      ]}
    >
      <Meta
        title={product.name}
        description={truncateText(product.description, 20)}
        style={{ minHeight: 100, fontSize: 12 }}
      />
      <Tag color="magenta">{formatUSD(product.price)}</Tag>
    </Card>
  );
};

export default ProductCard;
