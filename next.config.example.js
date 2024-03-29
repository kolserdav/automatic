const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    KEY_DAYS: 3,
    CAPTCHA_SECRET: 'CAPTCHA secret'
  }
}