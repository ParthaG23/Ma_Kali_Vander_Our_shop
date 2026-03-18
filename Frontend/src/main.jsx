import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SplashScreen from './components/common/SplashScreen';
import './index.css';

const Root = () => {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
