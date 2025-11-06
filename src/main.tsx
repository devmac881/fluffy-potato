import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapboxProvider } from './state/mapbox-context';
import App from './App';
import './styles/index.css';

const queryClient = new QueryClient();

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MapboxProvider>
        <App />
      </MapboxProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
