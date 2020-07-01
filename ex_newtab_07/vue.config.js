const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports  = {
  publicPath: process.env.NODE_ENV === 'production' ? 'static' : '/',
  outputDir: '../ex_newtab_production/static',
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  devServer: {
    port: process.env.NODE_ENV === 'production' ? 80 : 8000,
    proxy: {
      '/api': {
        // 目标： 指向的网络地址
        target: 'http://tapi4.minibai.com/',
        secure: false,
        // webpack的属性，映射一个host
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}