const LodashPlugin = require('lodash-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('lodash').use(LodashPlugin).end()
      .plugin('moment').use(MomentLocalesPlugin).end()
    config
      .devServer
      .host('0.0.0.0')
      .port(5000)
      .disableHostCheck(true)
      .end()
    // 构建分析
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap(options => {
        options[0].minify.removeAttributeQuotes = false
        return options
      })
      if (process.env.npm_config_report) {
        config.plugin('analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
  }
}
