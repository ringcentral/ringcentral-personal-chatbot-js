
import express from 'express'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import cookieParser from 'cookie-parser'
import sequelize from './models/sequelize'
import viewIndex from './routes/view-index'
import initWebhook from './routes/webhook'
import { initDb, viewDb } from './routes/admin'
import oauth from './routes/oauth'
import logout from './routes/logout'
import api from './routes/api'
import morgan from 'morgan'
import { resolve } from 'path'
import basicAuth from 'express-basic-auth'

const {
  RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
  RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
} = process.env
const auth = basicAuth({
  users: {
    [RINGCENTRAL_CHATBOT_ADMIN_USERNAME]: RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
  }
})
const SessionStore = require('@electerm/express-session-sequelize')(expressSession.Store)
const sequelizeSessionStore = new SessionStore({
  db: sequelize,
  expiration: 24 * 60 * 60 * 1000 * 365
})

const app = express()
const staticPath = resolve(__dirname, '../../dist/static')

app.use(express.static(staticPath))
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressSession({
  secret: process.env.SERVER_SECRET || 'some secret',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false
}))
app.set('views', resolve(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/logout', logout)
app.get('/test', (req, res) => res.send('server running'))
app.get('/rc/oauth', oauth)
app.post('/api/action', api)
app.put('/admin/setup-database', auth, initDb)
app.get('/admin/view-database', auth, viewDb)

export const initApp = (conf) => {
  app.get('/', viewIndex(conf))
  app.post('/rc/webhook', initWebhook(conf))
  for (let skill of conf.skills) {
    if (skill.appExtend) {
      skill.appExtend(app)
    }
  }
  return app
}
