import {
  Card,
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Anchor,
  Upload,
  UploadFile,
  Image,
} from 'antd';
import React, { useState } from 'react';
import {
  useProductListQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
} from './_ProductService';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTreeViewCategoryListQuery } from '../../components/TreeView/_TreeViewService';
import { useImageUploader } from '../../hooks';
import LastModifiedWidget from '../../components/CustomeWidgets/LastModifiedWidget';
import DropDown from '../../components/DropDown';
const Products: React.FC = () => {
  const pageSizeOptions = [5, 10, 20, 50];
  const defaultPageSize = parseInt(localStorage.getItem('product_page_size') || '5');
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent_id') || '';
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const { getBase64Images } = useImageUploader();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductListQuery({
    page,
    count: pageSize,
    searchTerm: parentId,
    sortField: sorter.field,
    sortOrder: sorter.order,
  });
  const { data: categoryList = [] } = useTreeViewCategoryListQuery({});
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [editProduct, { isLoading: isEditing }] = useEditProductMutation();
  console.log('categoryList', categoryList);

  const dataSource =
    data?.data?.map((item: any, index: number) => ({
      key: item.id || index,
      name: item.name || 'N/A',
      category: item.category || 'N/A',
      description: item.description || 'N/A',
      price: item.price || 0,
      lastModified: item.lastModified || 'N/A',
      picture: item.picture || [],
      parent_id: item.parent_id || 'N/A',
    })) || [];

  const lastModifiedProduct = [...dataSource].sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )[0];
  const columns = [
    {
      title: 'Image',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture: string[]) => {
        if (picture && picture.length > 0 && picture[0].startsWith('data:image')) {
          return (
            <Image
              width={50}
              height={50}
              src={picture[0]}
              alt="thumbnail"
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          );
        }
        return <span>No Image</span>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: any) => (
        <Link to={`/product-details/${record.key}`}>{text}</Link>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
    { title: 'parent_id', dataIndex: 'parent_id', key: 'parent_id', hidden: true },
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

  const findCategoryTitle = (categories: any[], targetKey: string): string | null => {
    for (const category of categories) {
      if (category.key === targetKey) return category.title;
      if (category.children) {
        const result = findCategoryTitle(category.children, targetKey);
        if (result) return result;
      }
    }
    return null;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const pictures = await getBase64Images(fileList);

      const categoryTitle = findCategoryTitle(categoryList, values.parent_id);
      const payload = {
        ...values,
        id: currentProduct?.key,
        //category: categoryList?.find((cat: any) => cat.id === values.parent_id)?.name,
        category: categoryTitle, // 🟢 set the title
        lastModified: new Date().toISOString(),
        picture: pictures,
      };

      if (isEditMode) {
        await editProduct(payload).unwrap();
        message.success('Product updated successfully!');
      } else {
        await addProduct(payload).unwrap();
        message.success('Product added successfully!');
      }

      form.resetFields();
      setFileList([]);
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
    console.log('record', record);
    setIsEditMode(true);
    setCurrentProduct(record);
    setFileList(record.picture.map((pic: string, index: number) => ({ uid: index, url: pic })));
    const categoryTitle = findCategoryTitle(categoryList, record.parent_id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      parent_id: categoryTitle,
    });
    setOpen(true);
  };
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

  const handleTableChange = (pagination: any, filters: any, sorterObj: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    localStorage.setItem('product_page_size', pagination.pageSize);
    setSorter({
      field: sorterObj.field,
      order:
        sorterObj.order === 'ascend' ? 'asc' : sorterObj.order === 'descend' ? 'desc' : undefined,
    });
  };
  const getLeafCategories = (categories: any[]): any[] => {
    let leafNodes: any[] = [];

    for (const cat of categories) {
      if (!cat.children || cat.children.length === 0) {
        leafNodes.push({ key: cat.key, title: cat.title });
      } else {
        leafNodes = [...leafNodes, ...getLeafCategories(cat.children)];
      }
    }

    return leafNodes;
  };

  const renderCategoryOptions = (): React.ReactNode[] => {
    const leafCategories = getLeafCategories(categoryList);
    return leafCategories.map((cat) => (
      <Select.Option key={cat.key} value={cat.key}>
        {cat.title}
      </Select.Option>
    ));
  };

  return (
    <>
      <Card title="Dashboard">
        {lastModifiedProduct && <LastModifiedWidget product={lastModifiedProduct} />}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          style={{ marginBottom: 16 }}
          onClick={() => {
            form.resetFields();
            setIsEditMode(false);
            setCurrentProduct(null);
            setOpen(true);
            if (parentId) {
              form.setFieldsValue({ parent_id: parentId });
            }
          }}
        >
          Add Product
        </Button>
        <DropDown />
        <Table
          dataSource={dataSource}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions.map(String),
            total: data?.total || 0,
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
            <Select placeholder="Select a category" showSearch optionFilterProp="children">
              {renderCategoryOptions()}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
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
