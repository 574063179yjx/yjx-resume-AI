import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 仅发布 public 中经过整理和优化的网页资源，Resource 保留原始素材。
  publicDir: 'public',
})
