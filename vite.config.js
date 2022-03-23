import { defineConfig } from 'vite'
// import { sync } from './logic/liveAvatar'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api/v1/'),
      },
    },
  },
  slidev: {
    serverRef: {
      state: {
        vitar: {
          sync: false,
          data: {},
        },
      },
      // onChanged: (name, data, patch) => {
      //   if (name === 'vitar' && data.sync)
      //   // sync.value = true

      //     console.log(patch)
      // },
    },
  },
})
