import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ErrorData {
  errorMessage: string;
}

// const handleLogout = () => {
//     localStorage.removeItem("token");
//     console.log("Session expired");
//     window.location.reload();
// };

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any = {}) => {
  const baseUrl = 'http://localhost:5000';
  const dynamicBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });

  const result = await dynamicBaseQuery(args, api, extraOptions);
  console.log('API call result:', result);

  const { error } = result;
  if (error) {
    const { status, data } = error as { status: number | string; data: ErrorData };

    switch (status) {
      case 'FETCH_ERROR':
        console.error('FETCH_ERROR occurred:', error);
        //handleLogout();
        break;
      case 409:
        // toastMessage(data?.errorMessage, "ERROR", "Error");
        break;
      default:
        console.error('Unexpected error:', error);
        break;
    }

    throw error.data;
  }

  return result;
};
