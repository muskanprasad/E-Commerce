// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // Temporarily comment out React.StrictMode
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
);