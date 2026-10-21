import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  // Relative assets work at both the repository URL and the custom-domain root.
  base: './',
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
