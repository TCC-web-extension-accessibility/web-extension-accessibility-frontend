/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import path from 'path'; // Import 'path' module
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  // Adjust cacheDir to be relative to the new project root 'widget'
  cacheDir: '../../node_modules/.vite/apps/widget', // Assuming you renamed the app to 'widget'

  // Remove server and preview configs, as these are for development of a standalone app.
  // Your widget won't have its own server.
  // If you still need a local dev server for a demo page, that would be in a *separate* Vite config or app.
  // server: {
  //   port: 4200,
  //   host: 'localhost',
  // },
  // preview: {
  //   port: 4300,
  //   host: 'localhost',
  // },

  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ], // If you use nxViteTsPaths, make sure to import it
  // },

  build: {
    // Crucial: Set outDir relative to the monorepo root for consistent output
    outDir: '../../dist/apps/widget', // Or choose a shared 'dist/widget' if preferred
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // ** THIS IS THE KEY PART: Configure as a library **
    lib: {
      // The entry point for your widget. This should be the file that initializes your React app.
      entry: path.resolve(__dirname, 'src/main.tsx'), // Assuming main.tsx is your entry
      name: 'YourAccessibilityWidget', // This will be the global variable name (e.g., window.YourAccessibilityWidget)
      fileName: (format) => `accessibility-widget.${format}.js`, // Output filename pattern
      formats: ['umd'], // UMD format is best for script tag embedding (Universal Module Definition)
    },
    rollupOptions: {
      // Externalize React and ReactDOM ONLY if you expect the host page to *already* provide them.
      // For a self-contained widget that works on *any* site, remove these from external.
      // If you leave them external, your bundle will be smaller, but the host site MUST load React.
      output: {
        // These are global variables that the external dependencies will be mapped to.
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
