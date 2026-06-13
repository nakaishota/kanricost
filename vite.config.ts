/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages の project サイトは https://<user>.github.io/<repo>/ で配信されるため、
// 本番ビルドのみサブパスを base に設定する(dev / preview はルート配信のまま)。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kanricost/' : '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))
