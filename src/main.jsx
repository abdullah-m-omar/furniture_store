import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import "./i18n";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import LocaleProvider from './context/LocaleContext.jsx';
import AuthProvider from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
src/main.jsx
