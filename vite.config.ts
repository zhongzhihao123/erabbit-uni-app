import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@dcloudio/uni-ui'],
  },
  build: {
    // 开启 sourcemap 映射源码
    sourcemap: true,
  },
  plugins: [
    uni({
      vueOptions: {
        // 开启响应性语法糖
        reactivityTransform: true,
      },
    }),
  ],
})
