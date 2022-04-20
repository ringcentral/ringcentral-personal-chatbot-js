/**
 * view index
 */

import copy from 'json-deep-copy'
import _ from 'lodash'
import { pack, jwtPrefix, defaultState, buildLoginUrlRedirect } from '../common/constants'

const { RINGCENTRAL_CHATBOT_SERVER, CDN } = process.env

function buildBotInfo (conf) {
  const props = ['name', 'description', 'settingPath', 'homepage']
  const info = _.pick(conf, props)
  info.skills = conf.skills.map(s => _.pick(s, props))
  return info
}

export default (conf) => {
  const botInfo = buildBotInfo(conf)
  return async (req, res) => {
    const url = await buildLoginUrlRedirect()
    console.log('url', url)
    const data = {
      version: pack.version,
      title: pack.name,
      server: RINGCENTRAL_CHATBOT_SERVER,
      cdn: CDN || RINGCENTRAL_CHATBOT_SERVER,
      jwtPrefix,
      defaultState,
      authUrlDefault: url,
      botInfo
    }
    data._global = copy(data)
    res.render('index', data)
  }
}
