import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import vueSetupExtend from "unplugin-vue-setup-extend-plus/vite"
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import path from 'path'
import vueJsx from "@vitejs/plugin-vue-jsx";

const getIPAdress = (ipStart: string = '192') => {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.address.startsWith(ipStart)) {
        return alias.address;
      }
    }
  }
}
/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, __dirname);
  return {
    plugins: [
      vue(),
      vueJsx(),
      // name 可以写在 script 标签上
      vueSetupExtend({}),
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用
        deleteOriginFile: false, // 删除源文件
        threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b
        algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz' // 生成的压缩包后缀
      }),
      createSvgIconsPlugin({ // 全局使用svg
        iconDirs: [path.resolve(root, 'src/icons/svg')], // 指定需要缓存的图标文件夹
        symbolId: 'icon-[dir]-[name]', // 指定symbolId格式
      })
    ],
    base: env.VITE_HOST,
    server: {
      cors: true,
      port: 9001,
      host: true,
      proxy: { // 代理
        "/api": {
          target: env.VITE_PROXY,
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, '')
        },
        "/upload": {
          target: env.VITE_UPLOAD,
          changeOrigin: true,
        },
      },
      hmr: { // 本地使用了whistle代理，此时会无效得进行刷新请求。解决方案
        protocol: 'ws', // WebSocket协议
        host: getIPAdress()
      }  
    },
    build: { // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      minify: 'terser', // esbuild
      assetsInlineLimit: 8 * 1024, // 如果静态资源体积 >= 4KB，则提取成单独的文件 如果静态资源体积 < 4KB，则作为 base64 格式的字符串内联
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
      },
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 1500,
			rollupOptions: {
        // 静态资源分类打包，自动分割包名输出 chunkSizeWarningLimit 配置大小
				output: {
					chunkFileNames: "assets/js/[name]-[hash].js", // 入口文件名
					entryFileNames: "assets/js/[name]-[hash].js", // 出口文件名位置
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"  // 静态文件名位置
				}
			}
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
      // 忽略后缀名的配置项
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.node', '.scss'],
    },
  };
})
