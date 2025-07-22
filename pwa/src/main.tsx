import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { registerSW } from './utils/registerSW';
import { HashRouter as Router } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      {/* <BrowserRouter> */}
        <App />
      {/* </BrowserRouter> */}
    </Router>
  </StrictMode>
);

// Register service worker
registerSW();