// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [ react() ],
  css: {
    postcss: {
      plugins: [
        // tailwindcss plugin will be used via postcss.config
        // you can optionally import tailwindcss here if needed
        // but it's simpler to let postcss.config handle it
      ]
    }
  }
});
