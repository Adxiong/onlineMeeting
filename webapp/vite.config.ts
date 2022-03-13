/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 15:48:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-13 22:08:08
 */
import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0"
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias:[
      { find: /~/, replacement: path.resolve('./', 'node_modules') },
      { find: '@', replacement: path.resolve('./', 'src') }
    ]
  }
})
