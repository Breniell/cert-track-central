
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuration Vite spécifique pour l'intégration Moodle
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main-moodle.tsx'),
      name: 'CimencamPlus',
      fileName: 'cimencam-plus',
      formats: ['iife'] // Format IIFE pour l'intégration directe dans Moodle
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'cimencam-plus.css';
          }
          return assetInfo.name as string;
        }
      },
      external: ['react', 'react-dom'] // Utiliser React depuis Moodle si disponible
    },
    outDir: 'dist-moodle',
    emptyOutDir: true
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  }
});
