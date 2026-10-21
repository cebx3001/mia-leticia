import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/mia-leticia/',
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        reservation: 'reservar/index.html',
        reservationThanks: 'reservar/gracias/index.html',
      },
    },
  },
});
