import { defineConfig } from 'vite'

export default defineConfig(
  (process.env.REDEFINE_HMR === 'true')
    ? {
      server: {
        hmr: {
        // https://vitejs.dev/config/#server-hmr
          clientPort: 80,
        },
      },
    }
    : {
      server: {
        proxy: { // 代理配置
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '/api/v1/'),
          },
        },
      },
    },
)
