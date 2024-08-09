import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    cors: true, // 允许跨域
    proxy:  {
        "/api" : {
             target: "http://0.0.0.0:3000",   //需要跨域的目标url
             changeOrigin: true,  // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
             secure: false,         
             rewrite: (path) => path.replace(/^\/api/, ""),
        }
    }
  },
  resolve:{
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
})
