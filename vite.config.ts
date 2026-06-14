/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// トップ画面に出すバージョン表記。デプロイのたびに変わるよう
// package.json のバージョン + ビルド日 + git の短縮ハッシュを埋め込む。
function appVersion(): string {
  const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
  ) as { version: string }
  let hash = 'local'
  try {
    hash = execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    // git が無い環境でもビルドは通す
  }
  const date = new Date().toISOString().slice(0, 10)
  return `v${pkg.version} · ${date} · ${hash}`
}

// GitHub Pages の project サイトは https://<user>.github.io/<repo>/ で配信されるため、
// 本番ビルドのみサブパスを base に設定する(dev / preview はルート配信のまま)。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kanricost/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion()),
  },
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))
