import React from 'react';
import ReactDOM from 'react-dom/client'; // Update import for React 18+
import './index.css'; // Your CSS file
import App from './App'; // Your main App component

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
