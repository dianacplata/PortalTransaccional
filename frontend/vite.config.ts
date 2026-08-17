import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    // Expone vars de entorno como process.env.* para compatibilidad con
    // ts-jest que corre en CommonJS y no dispone de import.meta.env
    define: {
      'process.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'http://localhost:3000/api',
      ),
      'process.env.VITE_BASE_FEE_CENTS': JSON.stringify(
        env.VITE_BASE_FEE_CENTS || '300000',
      ),
      'process.env.VITE_DELIVERY_FEE_CENTS': JSON.stringify(
        env.VITE_DELIVERY_FEE_CENTS || '150000',
      ),
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
