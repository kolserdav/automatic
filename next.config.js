const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}