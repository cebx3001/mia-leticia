import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from '../app/page';
import WhatsApp from '../components/whatsapp';
import '../app/globals.css';
import '../app/photo-refresh.css';
import '../app/narrative-pass.css';
import '../app/photo-fallback.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
    <WhatsApp />
  </StrictMode>,
);
