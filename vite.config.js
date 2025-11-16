import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sdk.js',
      name: 'LDJWidget',
      formats: ['iife'], // script global
      fileName: () => 'widgets/sdk.js',
    },
  },
});

