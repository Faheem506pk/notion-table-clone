import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'local', // Ensures that CSS modules are scoped locally by default
      generateScopedName: '[name]__[local]__[hash:base64:5]', // Optional scoped name format
    },
  },
})
