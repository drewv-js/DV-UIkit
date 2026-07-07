import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'auto-register': resolve(__dirname, 'src/auto-register.ts'),
        react: resolve(__dirname, 'src/react.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@lit/react',
        'lit',
        'lit/directives/class-map.js'
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    sourcemap: true,
    target: 'es2022',
    minify: 'esbuild'
  }
});
