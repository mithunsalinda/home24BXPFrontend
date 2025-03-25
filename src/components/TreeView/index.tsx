import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type {  TreeProps } from 'antd';
import { useTreeViewCategoryListQuery } from './_TreeViewService';
import { useNavigate } from 'react-router-dom';


const TreeView: React.FC = () => {
  const { data = [] } = useTreeViewCategoryListQuery<any>({});
  const navigate = useNavigate();

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    const selectedKey = selectedKeys[0];
    if (selectedKey) {
      navigate(`/dashboard?parent_id=${selectedKey}`);
    }
  };

  return (
    <>
      <h2 style={{ padding: 10, fontSize: 14 }}>Product List</h2>
      <Tree
        showLine
        style={{ backgroundColor: 'rgb(67, 124, 255)', borderRadius: 0, color: 'white' }}
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={[]}
        onSelect={onSelect}
        treeData={data}
      />
    </>
  );
};

export default TreeView;
