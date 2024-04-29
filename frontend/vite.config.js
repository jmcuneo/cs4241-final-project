// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || 8000}`,
        changeOrigin: true,
        secure: false,
        ws: true,  // Important for WebSocket to work through the proxy
      }
    }
  },
});
