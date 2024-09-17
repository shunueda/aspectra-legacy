import { type Options, defineConfig } from 'tsup'
import { compilerOptions } from './tsconfig.json'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  keepNames: true,
  format: 'esm',
  dts: true,
  target: compilerOptions.target as Options['target'],
})
