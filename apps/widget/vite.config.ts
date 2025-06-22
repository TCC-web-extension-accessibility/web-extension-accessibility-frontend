import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Load environment variables from .env files
const envFile =
  process.env.NODE_ENV === 'production'
    ? './.env.production'
    : './.env.development';
const loadedEnv = config({ path: envFile }).parsed || {};

const processEnvDefine: { [key: string]: string } = {};
for (const key in loadedEnv) {
  processEnvDefine[`process.env.${key}`] = JSON.stringify(loadedEnv[key]);
}

console.log(process.env.NODE_ENV);

processEnvDefine['process.env.NODE_ENV'] = JSON.stringify(
  process.env.NODE_ENV || 'development'
);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    process: JSON.stringify({ env: {} }),
    global: 'window',
    ...processEnvDefine,
  },
  build: {
    lib: {
      entry: './src/widget/index.tsx',
      name: 'widget',
      formats: ['iife'],
    },
    minify: false,
    cssCodeSplit: false,
    outDir: '../../dist/widget',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'widget.js',
        inlineDynamicImports: true,
      },
    },
  },
});
