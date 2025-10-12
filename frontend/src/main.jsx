import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import AuthContextProvider from './contexts/AuthContext.jsx';
import CartContextProvider from './contexts/CartContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      // retry: (failureCount, error) => {
      //   if (error?.response?.status === 404) return false;
      //   if (error?.response?.status >= 500) return failureCount < 3;
      //   return failureCount < 2;
      // },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
