import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../store/apiCommon';
export const ProductsReducer = createApi({
  reducerPath: 'ProductService',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder: any) => ({
    productList: builder.query({
      query: ({ page, count, sortField, sortOrder }: any) => {
        const start = (page - 1) * count;
        return {
          url: `/products`,
          params: {
            start,
            count,
            //parent_id: searchTerm || '',
            _sort: sortField || 'name',
            _order: sortOrder || 'desc',
          },
        };
      },
      providesTags: ['Products'],
      transformResponse: (response: any, meta: any, arg: any) => {
        const { searchTerm, sortField = 'name', sortOrder = 'desc' } = arg;
        const filtered = searchTerm
          ? response.filter((item: any) => item.parent_id?.startsWith(searchTerm))
          : response;
        const sorted = [...filtered].sort((a, b) => {
          const valA = a[sortField];
          const valB = b[sortField];

          if (typeof valA === 'string') {
            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return {
          data: sorted,
          contentRange: meta?.response?.headers?.get('Content-Range'),
        };
      },
    }),
    addProduct: builder.mutation({
      query: (product: any) => ({
        url: `/products`,
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    editProduct: builder.mutation({
      query: (product: any) => ({
        url: `/products/${product.id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (id: any) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    productById: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
      }),
    }),
  }),
});

export const {
  useProductListQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useProductByIdQuery,
} = ProductsReducer;
