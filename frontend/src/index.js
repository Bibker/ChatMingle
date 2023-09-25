import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatProvider>
    <BrowserRouter>
    <ChakraProvider>
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </ChatProvider>
);


