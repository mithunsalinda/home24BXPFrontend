// main.tsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import './index.css';
import App from './App.tsx';
import './assets/styles/index.scss';
import { rehydrateAuth } from './util/rehydrateAuth.ts';
import { store } from './store/store.ts';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { autoAttributesPlugin } from '@growthbook/growthbook/plugins';

const gb = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: 'sdk-ClmbWSznoUlsYtZ',
  enableDevMode: true,
  plugins: [autoAttributesPlugin()],
});

gb.init({ streaming: true });

rehydrateAuth(store);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GrowthBookProvider growthbook={gb}>
      <App />
    </GrowthBookProvider>
  </StrictMode>
);
