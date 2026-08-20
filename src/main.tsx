import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
