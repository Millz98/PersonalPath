// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider
import { ChakraProvider } from '@chakra-ui/react';
import './index.css'; // Your global styles
import reportWebVitals from './reportWebVitals'; // Add this import
// If using Chakra UI, ChakraProvider might also be here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        {/* If using Chakra UI, ChakraProvider would likely go here or wrap AuthProvider */}
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
