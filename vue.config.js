const path = require('path');
const IS_PROD = ['production'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  lintOnSave: !IS_PROD,
  productionSourceMap: !IS_PROD,
  devServer: {
    host: 'localhost',
    port: 8080, // 端口号
    open: true, // 配置自动启动浏览器
    proxy: { // 配置多个跨域
      '/api': {
        target: 'https://test-smt-matrix-web.primeledger.cn',
        // target: 'http://192.168.58.2:18080', // ye zai yongs
        // target: 'http://10.200.174.52:31165', // dev
        // target: 'http://192.168.58.76:18080', // lijian
        // target: 'http://192.168.58.29:18080', // xiangyi
        changeOrigin: true,
        ws: true, // websocket支持
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));

    // 生产环境配置
    if (IS_PROD) {
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      config.optimization.minimize(true);
      config.optimization.splitChunks({
        chunks: 'all'
      });
    }
  },
  css: {
    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入
    // extract: true,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false
  }
};
