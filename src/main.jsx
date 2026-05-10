import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { POSProvider } from './context/POSContext';
import { DataProvider } from './context/DataContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <DataProvider>
          <POSProvider>
            <App />
          </POSProvider>
        </DataProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
