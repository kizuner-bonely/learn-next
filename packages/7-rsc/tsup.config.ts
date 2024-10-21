import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: { index: path.resolve(__dirname, 'index.ts') },
  format: ['esm', 'cjs'],
  target: 'esnext',
  sourcemap: true,
  splitting: false,
  onSuccess: 'node dist/index.js',
})
