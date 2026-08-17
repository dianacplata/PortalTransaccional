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
    // Expone VITE_API_URL como process.env.VITE_API_URL para compatibilidad
    // con ts-jest que corre en CommonJS y no dispone de import.meta.env
    define: {
      'process.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'http://localhost:3000/api',
      ),
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
