
import express from 'express'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import sequelize from './models/sequelize'
import viewIndex from './routes/view-index'
import webhook from './routes/webhook'
import oauth from './routes/oauth'
import { initDb } from './routes/admin'
import morgan from 'morgan'
import { resolve } from 'path'

const SessionStore = require('@electerm/express-session-sequelize')(expressSession.Store)
const sequelizeSessionStore = new SessionStore({
  db: sequelize,
  expiration: 24 * 60 * 60 * 1000 * 365
})

const app = express()
const cwd = process.cwd()
const staticPath = resolve(cwd, 'dist', 'static')

app.use(express.static(staticPath))
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressSession({
  secret: process.env.SERVER_SECRET || 'some secret',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))
app.set('views', resolve(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/', viewIndex)
app.get('/test', (req, res) => res.send('server running'))
app.get('/rc/oauth', oauth)
app.post('/rc/webhook', webhook)
app.put('/admin/setup-database', initDb)
export default app
