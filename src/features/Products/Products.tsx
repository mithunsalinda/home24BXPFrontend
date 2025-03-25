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
  Upload,
  UploadFile,
  Image,
  Pagination,
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
import { hasSubCategories } from '../../util/findCategoryInfo';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { DataSourceItem } from './Products.type';
import { notifyError, notifySuccess } from '../../util/notify';
import { priceValidationRules, productNameValidationRules } from '../../util/validation';
import { render } from '@testing-library/react';
import { formatted, formatUSD } from '../../util/formatter';
import ProductCard from '../../components/ProductCard';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
const Products: React.FC = () => {
  const enabled = useFeatureIsOn('productView');
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
  const {
    data = { data: [] },
    isLoading,
    isError,
  } = useProductListQuery({
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

  const dataSource: DataSourceItem[] =
    data?.data?.map((item: any, index: number) => ({
      key: item.id || index,
      name: item.name || 'N/A',
      category: item.category || 'N/A',
      description: item.description || 'N/A',
      price: item.price || 0,
      lastModified: item.lastModified || 'N/A',
      picture: item.picture || [],
      parent_id: item.parent_id || 'N/A',
      isModified: item.isModified,
    })) || [];

  const lastModifiedProduct = [...dataSource]
    .filter((product) => product.isModified)
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0];
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
        return (
          <div
            style={{
              backgroundColor: '#afaaaacc',
              height: 50,
              width: 50,
              justifyContent: 'center',
              fontSize: 10,
              alignItems: 'center',
              display: 'flex',
              borderRadius: 4,
            }}
          >
            No Image
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: '20%',
      render: (text: string, record: any) => (
        <Link to={`/product-details/${record.key}`}>{text}</Link>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '30%' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => {
        const priceNum = parseFloat(price);
        return <>{!isNaN(priceNum) ? formatUSD(priceNum) : '-'}</>;
      },
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (record: any) => <>{moment(record.lastModified).format('YYYY-MM-DD HH:mm')}</>,
    },
    { title: 'Parent_id', dataIndex: 'parent_id', key: 'parent_id', hidden: true },
    {
      title: 'isModified',
      dataIndex: 'isModified',
      key: 'isModified',
      hidden: true,
      render: (record: any) => <>{record.isModified ? 'true' : 'false'}</>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
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
      let errror = DOMPurify.sanitize(values.description);
      if (values.description !== errror) {
        notifyError('Wrong Input');
        return;
      }
      const payload = {
        ...values,
        description: DOMPurify.sanitize(values.description),
        id: currentProduct?.key,
        category: categoryTitle,
        lastModified: new Date().toISOString(),
        picture: pictures,
        isModified: false,
      };
      console.log('payload', payload);
      if (isEditMode) {
        const payloadEdit = {
          ...payload,
          isModified: true,
        };
        await editProduct(payloadEdit).unwrap();
        //message.success('Product updated successfully!');
        notifySuccess('Product updated successfully!');
      } else {
        const payloadAdd = {
          ...payload,
          isModified: false,
        };
        await addProduct(payloadAdd).unwrap();
        notifySuccess('Product added successfully!');
      }

      form.resetFields();
      setFileList([]);
      setCurrentProduct(null);
      setIsEditMode(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      notifyError(isEditMode ? 'Failed to update product' : 'Failed to add product');
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
      parent_id: record.parent_id,
      category: categoryTitle,
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

  const isLeafCategory = hasSubCategories(categoryList, parentId);

  return (
    <>
      <Card title="Dashboard">
        {lastModifiedProduct && <LastModifiedWidget product={lastModifiedProduct} />}
        {!isLeafCategory && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            style={{ marginBottom: 16 }}
            onClick={() => {
              form.resetFields();
              setIsEditMode(false);
              setCurrentProduct(null);
              setFileList([]);
              setOpen(true);
              if (parentId) {
                form.setFieldsValue({ parent_id: parentId });
              }
            }}
          >
            Add Product
          </Button>
        )}

        {/* <Table
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
        /> */}
        {enabled ? (
          <div className="productCardWrapper">
            {dataSource.map((product) => (
              <ProductCard product={product} deleteFunc={handleDelete} />
            ))}
            <div style={{ marginTop: 16, textAlign: 'center' }}></div>
          </div>
        ) : (
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
        )}
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
          <Form.Item name="name" label="Product Name" rules={productNameValidationRules}>
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
          <Form.Item name="price" label="Price" rules={priceValidationRules}>
            <Input type="number" placeholder="Enter price" addonBefore="$" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
