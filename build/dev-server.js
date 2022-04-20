
const { env } = process
const logger = require('morgan')
const devPort = env.DEV_PORT || 6066
const host = env.SERVER_HOST || '127.0.0.1'

module.exports = {
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  historyApiFallback: true,
  hot: true,
  host,
  port: devPort,
  client: {
    logging: 'log'
  },
  onBeforeSetupMiddleware: function (devServer) {
    devServer.app.use(
      logger('tiny')
    )
  },
  proxy: {
    '/': {
      target: `http://${env.SERVER_HOST}:${env.SERVER_PORT}`,
      bypass: function (req, res, proxyOptions) {
        if (req.path.includes('.bundle.')) {
          return req.path
        }
      }
    }
  }
}
