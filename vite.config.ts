import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 檢查是否是測試用例模式（用於 GitHub Pages）
const isExampleMode = process.env.BUILD_EXAMPLE === 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: isExampleMode ? '/vue3-rich-editor/' : '/', // ✅ GitHub Pages 模式才加上 repo 名稱
  build: isExampleMode
    ? {
        // 🔹 這裡是用來打包測試專案（GitHub Pages）
        outDir: 'dist-example', // ✅ 確保不覆蓋 `dist/`
      }
    : {
        // 🔹 這裡是用來打包 Vue 3 組件（npm）
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Vue3RichEditor',
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
})
