import { resolve } from 'path'
import crypto from 'crypto'
import { User } from '../models/ringcentral'

const { RINGCENTRAL_CHATBOT_SERVER } = process.env
const arr = RINGCENTRAL_CHATBOT_SERVER.split('/')
const root = arr[0] + arr[1] + arr[2]
const user = new User()

export const defaultState = '__default_state_'
export const extraPath = RINGCENTRAL_CHATBOT_SERVER.replace(root, '')
export const pack = require(resolve(__dirname, '../../../package.json'))
export const jwtPrefix = crypto.createHash('md5').update(RINGCENTRAL_CHATBOT_SERVER).digest('hex')
export const authUrlDefault = user.authorizeUri(defaultState)
