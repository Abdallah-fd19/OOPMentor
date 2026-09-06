import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      pfx: fs.readFileSync('./devcert.pfx'),
      passphrase: 'devcertpassword',
    },
  },
})
