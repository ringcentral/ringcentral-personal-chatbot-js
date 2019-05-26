/**
 * bot control apis
 * /api
 */

import { User } from '../models/ringcentral'

const supportedActions = [
  'bot-signature-switch',
  'bot-switch'
]

export default async (req, res) => {
  let { user } = req.session
  if (!user) {
    res.status(401)
    return res.send('please login first')
  }
  let { body = {} } = req
  let {
    action,
    update
  } = body
  if (!supportedActions.includes(action)) {
    res.status(400)
    return res.send('not supported')
  }
  let { id } = user
  let result
  if (action === 'bot-signature-switch') {
    result = await User.update({
      signed: update.signed
    }, {
      where: {
        id
      }
    })
    req.session.user.signed = !!update.signed
  } else if (action === 'bot-switch') {
    let enabled = !!update.enabled
    let user = await User.findByPk(id)
    if (enabled || !user) {
      res.status(401)
      return res.send('user not find')
    }
    if (req.session.user.enabled && !enabled) {
      await user.ensureWebHook(true)
    }
    result = await User.update({
      enabled
    }, {
      where: {
        id
      }
    })
    req.session.user.enabled = enabled
  }
  res.send({
    status: 0,
    result
  })
}
