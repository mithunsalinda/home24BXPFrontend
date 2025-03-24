import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import './index.css';
import App from './App.tsx';
import './assets/styles/index.scss';
import { rehydrateAuth } from './util/rehydrateAuth.ts';
import { store } from './store/store.ts';

rehydrateAuth(store);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
