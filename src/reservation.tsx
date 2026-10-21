import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Reservation from '../app/reservation';
import '../app/reservation.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Reservation />
  </StrictMode>,
);
