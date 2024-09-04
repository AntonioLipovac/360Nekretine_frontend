import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://nekretnine360-backend.onrender.com',
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['swiper/react', 'swiper']
  },
  plugins: [react()],
});