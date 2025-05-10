import { defineConfig } from 'vite'

export default defineConfig({
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
      //     console.log(patch)
      // },
    },
  },
})
