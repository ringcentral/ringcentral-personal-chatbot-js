/**
 * view index
 */

import copy from 'json-deep-copy'
import { resolve } from 'path'
import _ from 'lodash'
import { User } from '../models/ringcentral'

const pack = require(resolve(__dirname, '../../../package.json'))
const inst = new User()
const { RINGCENTRAL_CHATBOT_SERVER } = process.env

function buildBotInfo (conf) {
  let props = ['name', 'description', 'settingPath', 'homepage']
  let info = _.pick(conf, props)
  info.skills = conf.skills.map(s => _.pick(s, props))
  return info
}

export default (conf) => {
  let botInfo = buildBotInfo(conf)
  return (req, res) => {
    let { id, user } = req.session
    let data = {
      version: pack.version,
      title: pack.name,
      sessionId: id,
      user: user || null,
      server: RINGCENTRAL_CHATBOT_SERVER,
      authUrl: inst.authorizeUri(user ? 'user' : id),
      botInfo
    }
    data._global = copy(data)
    res.render('index', data)
  }
}
