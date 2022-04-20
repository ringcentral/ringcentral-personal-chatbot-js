import { initApp, jwtAuth as jwt } from './app'
import * as defaultConfig from './handlers/default'

export const createApp = (config) => {
  const conf = Object.assign({}, defaultConfig, config)
  const app = initApp(conf)
  return app
}

export const jwtAuth = jwt
