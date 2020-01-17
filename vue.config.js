const LodashPlugin = require('lodash-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config.plugin('lodash-webpack-plugin')
      .use(LodashPlugin)
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
  }
}
