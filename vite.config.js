import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cit-sync/', // <-- AGREGA ESTA LÍNEA (con el nombre de tu repo rodeado de diagonales)
})