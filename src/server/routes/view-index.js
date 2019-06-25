/**
 * view index
 */

import copy from 'json-deep-copy'
import _ from 'lodash'
import { pack, jwtPrefix, authUrlDefault, defaultState } from '../common/constants'

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
    let data = {
      version: pack.version,
      title: pack.name,
      server: RINGCENTRAL_CHATBOT_SERVER,
      cdn: CDN || RINGCENTRAL_CHATBOT_SERVER,
      jwtPrefix,
      defaultState,
      authUrlDefault,
      botInfo
    }
    data._global = copy(data)
    res.render('index', data)
  }
}
