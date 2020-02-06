const LodashPlugin = require('lodash-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config
      .plugin('lodash').use(LodashPlugin).end()
      .plugin('moment').use(MomentLocalesPlugin).end()
    config
      .devServer.disableHostCheck(true).end()
    config.optimization.splitChunks({
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'all',
          minSize: 20,
          minChunks: 2
        }
      }
    })
    // 构建分析
    if (process.env.NODE_ENV === 'production') {
      config.externals({
        vue: 'Vue',
        moment: 'moment',
        'vue-router': 'VueRouter'
      })
      config.plugin('html').tap(options => {
        options[0].minify.removeAttributeQuotes = false
        return options
      }).end()
      config.plugin('compress').use(CompressionWebpackPlugin, [{
        test: /\.js$|\.html$|\.css$/,
        threshold: 0, // 超过10kb就压缩
        deleteOriginalAssets: false
      }])
      if (process.env.npm_config_report) {
        config.plugin('analyzer').use(WebpackBundleAnalyzer).end()
        config.plugins.delete('prefetch')
      }
    }
  }
}
