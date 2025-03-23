import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../store/apiCommon';

export const AuthReducer = createApi({
  reducerPath: 'authReducer',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder: any) => ({
    login: builder.query({
      query: (credentials: { email: string; password: string }) => ({
        url: `/users?email=${credentials.email}&password=${credentials.password}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useLazyLoginQuery } = AuthReducer;
