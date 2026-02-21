/// <reference types="vite/client" />
/// <reference types="vitest" />

import path, { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs-extra';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import { compression } from 'vite-plugin-compression2';
import { viteZip } from 'vite-plugin-zip-file';

import PACKAGE from './package.json';
import pluginSchema from './src/component/pluginSchema.json';

const PluginName = 'typed';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getIntegrity(filePath: string) {
  const data = await fs.promises.readFile(filePath);
  const hash = crypto.createHash('sha384').update(data).digest('base64');

  return `sha384-${hash}`;
}

export default defineConfig(({ mode }) => {
  const devMode = mode !== 'production';
  const onlyGzip = process.env.ONLY_GZIP === 'true';
  const onlyAnalyze = process.env.ONLY_ANALYZE === 'true';
  const asZip = process.env.AS_ZIP === 'true';

  return {
    plugins: [
      nodeResolve({ extensions: ['.js', '.mjs', '.ts', '.tsx'] }),
      react(),
      tailwindcss(),
      dts({
        rollupTypes: true,
        exclude: [
          '**/*.test.tsx',
          '**/*.stories.ts',
          '**/*.stories.tsx',
          'vite.config.ts'
          // 'setupTests.ts',
          // 'node_modules'
        ],
        tsconfigPath: './tsconfig.app.json'
      }),
      {
        name: 'debug-resolve',
        resolveId(/* source, importer */) {
          // console.log(`[VITE RESOLVE] Trying to resolve: ${source} from ${importer}`);
          return null; // Allow vite keep resolving
        }
      },
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
        PLUGIN_VERSION: JSON.stringify(PACKAGE.version)
      }),
      compression({
        algorithms: ['gzip'],
        filename: onlyGzip ? '[path][base]' : '[path][base].gz',
        deleteOriginalAssets: onlyGzip,
        threshold: 0
      }),
      {
        name: 'generate-manifest-json',
        async writeBundle() {
          const distPath = path.resolve(__dirname, 'dist');
          const files = await fs.readdir(distPath);

          const assets: Record<
            string,
            { src: string; integrity: string; type: 'script' | 'style'; srcPath: string; isMain: boolean }
          > = {};
          for (const file of files) {
            const fullPath = path.join(distPath, file);
            const integrity = await getIntegrity(fullPath);

            assets[file] = {
              src: file,
              integrity,
              type: file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs') ? 'script' : 'style',
              srcPath: `/plitzi-plugin-${PluginName}/${file}`,
              isMain: true
            };
          }

          const manifest = {
            author: 'Carlos Rodriguez <crodriguez@plitzi.com>',
            created: new Date().toLocaleDateString(),
            updated: new Date().toLocaleDateString(),
            version: `v${PACKAGE.version}`,
            root: PluginName,
            runtime: {
              scope: `PlitziPlugin${PluginName.charAt(0).toUpperCase() + PluginName.slice(1)}`,
              module: 'Plugin'
            },
            definition: {
              name: `Plitzi's ${PluginName.charAt(0).toUpperCase() + PluginName.slice(1)} Plugin`,
              description: '',
              owner: 'Plitzi',
              verified: true,
              license: 'MIT',
              website: 'https://plitzi.com',
              backgroundColor: '#4422ee',
              icon: 'https://cdn.plitzi.com/resources/img/favicon.svg'
            },
            pluginSchema,
            assets
          };

          await fs.writeFile(path.join(distPath, 'plugin-manifest.json'), JSON.stringify(manifest, null, 2));
          console.log('plugin-manifest.json generated via separate plugin!');
        }
      },
      viteZip({
        folderPath: 'dist',
        outPath: path.resolve(__dirname, 'dist'),
        zipName: `plitzi-plugin-${PluginName}.zip`,
        enabled: asZip,
        withoutMainFolder: true
      }),
      onlyAnalyze && visualizer({ filename: './dist/stats.html', open: true })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    },
    resolve: {
      alias: {
        // '@': resolve(__dirname, './src')
      },
      extensions: ['.js', '.mjs', '.ts', '.tsx']
    },
    build: {
      outDir: 'dist',
      ssrEmitAssets: true,
      lib: {
        entry: resolve(__dirname, './src/index.ts')
      },
      rollupOptions: {
        treeshake: false,
        external: ['@plitzi/plitzi-sdk', 'react', 'react-dom', 'react/jsx-runtime'],
        output: [
          // ESM -> .mjs
          {
            format: 'es',
            exports: 'named',
            manualChunks: undefined,
            inlineDynamicImports: true, // false if u want to have chunks !devMode,
            entryFileNames: `plitzi-plugin-${PluginName}.mjs`,
            chunkFileNames: `plitzi-plugin-${PluginName}-[name].mjs`,
            assetFileNames: `plitzi-plugin-${PluginName}[extname]`,
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
            }
          }
          // CJS -> .cjs
          // {
          //   format: 'cjs',
          //   preserveModules: false,
          //   // preserveModulesRoot: 'src',
          //   entryFileNames: `plitzi-plugin-${PluginName}.cjs`,
          //   chunkFileNames: `plitzi-plugin-${PluginName}-[name].cjs`,
          //   assetFileNames: `plitzi-plugin-${PluginName}[extname]`,
          //   exports: 'named',
          //   globals: {
          //     react: 'React',
          //     'react-dom': 'ReactDOM',
          //     'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
          //   }
          // }
        ]
      },
      minify: devMode ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: /(webpackIgnore:true|webpackIgnore: true|@vite-ignore)/,
          beautify: false
        }
      },
      sourcemap: devMode,
      emptyOutDir: true
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setupTests.ts'],
      server: {
        deps: {
          inline: ['@plitzi/plitzi-ui']
        }
      },
      coverage: {
        provider: 'v8',
        reporter: ['text'],
        reportsDirectory: 'tests',
        include: ['src'],
        exclude: ['**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'] // , 'src/index.ts'
      },
      reporters: ['default']
    }
  };
});
