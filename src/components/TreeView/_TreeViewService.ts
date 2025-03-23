import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../store/apiCommon';

export const TreeView = createApi({
  reducerPath: 'treeView',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['TreeView'],
  endpoints: (builder: any) => ({
    treeViewCategoryList: builder.query({
      query: () => ({
        url: `/category`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useTreeViewCategoryListQuery } = TreeView;
