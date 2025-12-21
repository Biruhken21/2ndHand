import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from '/src/context/AuthContext.jsx';
import {HelmetProvider} from 'react-helmet-async';  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
