import { Card, Table, Spin, Button, Modal, Form, Select, Input, message } from 'antd';
import React, { useState } from 'react';
import { useProductListQuery, useAddProductMutation } from './_ProductService';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useSearchParams } from 'react-router-dom';
import { useTreeViewCategoryListQuery } from '../../components/TreeView/_TreeViewService';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent_id') || '';

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const count = 5;

  const { data, isLoading, isError } = useProductListQuery({ page, count, searchTerm: parentId });
  const { data: categoryList = [] } = useTreeViewCategoryListQuery({});
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  const dataSource =
    data?.data?.map((item: any, index: number) => ({
      key: item.id || index,
      name: item.name || 'N/A',
      category: item.category || 'N/A',
      description: item.description || 'N/A',
      price: item.price || 0,
      lastModified: item.lastModified || 'N/A',
    })) || [];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <p>Failed to load data.</p>;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("first values", values);
      const payload = {
        ...values,
        category: categoryList?.find((cat: any) => cat.id === values.parent_id)?.name,
        lastModified: new Date().toISOString(),
        picture: [],
      }

      await addProduct(payload).unwrap();
      message.success('Product added successfully!');
      form.resetFields();
      setOpen(false);
    } catch (err) {
      console.error(err);
      message.error('Failed to add product');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Card title="Dashboard">
        <p>Welcome to the Backoffice System!</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          style={{ marginBottom: 16 }}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: page,
            pageSize: count,
            onChange: (p) => setPage(p),
          }}
        />
      </Card>

      <Modal
        title="Add New Product"
        open={open}
        onOk={handleOk}
        confirmLoading={isAdding}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item name="parent_id" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
              {categoryList?.map((cat: any) => (
                <Select.Option key={cat.id} value={cat.parent_id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
