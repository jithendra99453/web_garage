import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Add this proxy configuration
    proxy: {
      // This will proxy any request starting with /api
      '/api': {
        target: 'http://localhost:5000', // The address of your backend server
        changeOrigin: true, // Recommended to avoid CORS issues
        secure: false,      // Recommended for local development
      },
    },
  },
});
