import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AuthReducer } from '../features/Auth/_LoginService';

import authSlice from '../features/Auth/_LoginSlice';
import { ProductsReducer } from '../features/Products/_ProductService';
import { TreeView } from '../components/TreeView/_TreeViewService';
export const store = configureStore({
  reducer: {
    [AuthReducer.reducerPath]: AuthReducer.reducer,
    [ProductsReducer.reducerPath]: ProductsReducer.reducer,
    [TreeView.reducerPath]: TreeView.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthReducer.middleware,
      ProductsReducer.middleware,
      TreeView.middleware
    ),
});

setupListeners(store.dispatch);
