import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

module.exports=defineConfig({
  build:{
    assetsInlineLimit:2000,
    rollupOptions:{
      input:'index.html',   //默认值
      output:{
        entryFileNames:'bundle.[hash].js',
        chunkFileNames:'[name].chunk.js',
        // manualChunks:{
        //   vendor:['vue']
        // },
        manualChunks:(id)=>{
          if(id.includes('node_modules')){
            return 'vendor'
          }
        }
      }
    }
  },
  server:{
    port:8000,
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        rewrite:(path)=>{
          return path.replace(/^\/api/, '')
        }
      }
    },
    header:{

    }
  },
  resolve:{
    alias:{
      '@':__dirname+'/src'
    },
    extensions:['.js','.ts','.css']
  },
  plugins: [vue()],
  esbuild:{
    jsxFactory:"h",
    jsxFragment:"Fragment",
    jsxInject:"import {h} from 'vue'"
  }

})