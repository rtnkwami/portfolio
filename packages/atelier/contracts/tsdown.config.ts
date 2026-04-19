import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    './src/types/index.ts',
    './src/schemas/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  exports: {
    devExports: true
  }
})