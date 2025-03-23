import { Card, Table, Spin, Button, Modal, Form, Select, Input, message, Anchor } from 'antd';
import React, { useState } from 'react';
import {
  useProductListQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
} from './_ProductService';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTreeViewCategoryListQuery } from '../../components/TreeView/_TreeViewService';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent_id') || '';

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const [form] = Form.useForm();
  const count = 5;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductListQuery({ page, count, searchTerm: parentId });
  const { data: categoryList = [] } = useTreeViewCategoryListQuery({});
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [editProduct, { isLoading: isEditing }] = useEditProductMutation();
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
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Link to={`/product-details/${record.key}`}>{text}</Link>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            icon={<FileSearchOutlined />}
            onClick={() => openSingleProduct(record)}
          />
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isDeleting) return <p>Failed to load data.</p>;

  // const handleOk = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     console.log('first values', values);
  //     const payload = {
  //       ...values,
  //       category: categoryList?.find((cat: any) => cat.id === values.parent_id)?.name,
  //       lastModified: new Date().toISOString(),
  //       picture: [],
  //     };

  //     await addProduct(payload).unwrap();
  //     message.success('Product added successfully!');
  //     form.resetFields();
  //     setOpen(false);
  //   } catch (err) {
  //     console.error(err);
  //     message.error('Failed to add product');
  //   }
  // };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        id: currentProduct?.key,
        category: categoryList?.find((cat: any) => cat.id === values.parent_id)?.name,
        lastModified: new Date().toISOString(),
        picture: [],
      };

      if (isEditMode) {
        await editProduct(payload).unwrap();
        message.success('Product updated successfully!');
      } else {
        await addProduct(payload).unwrap();
        message.success('Product added successfully!');
      }

      form.resetFields();
      setCurrentProduct(null);
      setIsEditMode(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      message.error(isEditMode ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleEdit = (record: any) => {
    setIsEditMode(true);
    setCurrentProduct(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      parent_id: categoryList?.find((cat: any) => cat.name === record.category)?.parent_id,
    });
    setOpen(true);
  };
  // const handleCancel = () => {
  //   form.resetFields();
  //   setCurrentProduct(null);
  //   setIsEditMode(false);
  //   setOpen(false);
  // };

  const handleDelete = async (record: any) => {
    try {
      await deleteProduct(record.key).unwrap();
      message.success('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to delete product');
    }
  };

  const openSingleProduct = (record: any) => {
    navigate(`/product-details/${record.key}`);
  };
  return (
    <>
      <Card title="Dashboard">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          style={{ marginBottom: 16 }}
          onClick={() => {
            form.resetFields(); // Clear previous values
            setIsEditMode(false);
            setCurrentProduct(null);
            setOpen(true);

            // Set default category if parentId exists
            if (parentId) {
              form.setFieldsValue({ parent_id: parentId });
            }
          }}
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
