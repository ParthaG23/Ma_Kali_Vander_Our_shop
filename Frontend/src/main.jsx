import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import SplashScreen from './components/common/SplashScreen';
import './index.css';

const Root = () => {
  const [splashDone, setSplashDone] = useState(false);

  return !splashDone
    ? <SplashScreen onComplete={() => setSplashDone(true)} />
    : <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);