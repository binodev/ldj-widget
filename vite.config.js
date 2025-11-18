import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sdk.js',
      name: 'LDJWidget',
      formats: ['iife'], // script global
      fileName: () => 'widgets/sdk.js',
    },
  },
  plugins: [
    {
      name: 'copy-widget-html',
      closeBundle() {
        // S'assurer que le dossier widgets existe
        mkdirSync(join(process.cwd(), 'dist', 'widgets'), { recursive: true });
        // Copier widget.html dans dist/widgets/
        copyFileSync(
          join(process.cwd(), 'public', 'widget.html'),
          join(process.cwd(), 'dist', 'widgets', 'widget.html')
        );
      },
    },
  ],
});

