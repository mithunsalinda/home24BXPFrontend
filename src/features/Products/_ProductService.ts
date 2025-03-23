import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../store/apiCommon';
export const ProductsReducer = createApi({
  reducerPath: 'ProductService',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder: any) => ({
    productList: builder.query({
      query: ({ page, count, searchTerm }: any) => {
        const start = (page - 1) * count;
        return {
          url: `/products`,
          params: {
            start,
            count,
            parent_id: searchTerm || '',
          },
        };
      },
      providesTags: ['Products'],
      transformResponse: (response: any, meta: any) => ({
        data: response,
        contentRange: meta?.response?.headers?.get('Content-Range'),
      }),
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
