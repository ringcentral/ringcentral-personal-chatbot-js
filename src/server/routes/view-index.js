/**
 * view index
 */

import copy from 'json-deep-copy'
import _ from 'lodash'
import { User } from '../models/ringcentral'
import { pack, jwtPrefix } from '../common/constants'

const inst = new User()
const { RINGCENTRAL_CHATBOT_SERVER, CDN } = process.env

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
      server: RINGCENTRAL_CHATBOT_SERVER,
      cdn: CDN || RINGCENTRAL_CHATBOT_SERVER,
      authUrl: inst.authorizeUri(user ? 'user' : id),
      jwtPrefix,
      botInfo
    }
    data._global = copy(data)
    res.render('index', data)
  }
}
