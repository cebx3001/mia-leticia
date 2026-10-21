import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Reservation from '../app/reservation';
import WhatsApp from '../components/whatsapp';
import '../app/reservation.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Reservation />
    <WhatsApp />
  </StrictMode>,
);
