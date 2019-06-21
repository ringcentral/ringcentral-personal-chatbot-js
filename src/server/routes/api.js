/**
 * bot control apis
 * /api
 */

import { User } from '../models/ringcentral'

const supportedActions = [
  'bot-signature-switch',
  'bot-switch',
  'get-user'
]

export default async (req, res) => {
  let { user } = req
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
  if (action === 'get-user') {
    result = await User.findByPk(id)
  } else if (action === 'bot-signature-switch') {
    result = await User.update({
      signed: update.signed
    }, {
      where: {
        id
      }
    })
    req.user.signed = !!update.signed
  } else if (action === 'bot-switch') {
    let enabled = !!update.enabled
    let user = await User.findByPk(id)
    if (enabled || !user) {
      res.status(401)
      return res.send('user not find')
    }
    if (req.user.enabled && !enabled) {
      await user.ensureWebHook(true)
    }
    result = await User.update({
      enabled
    }, {
      where: {
        id
      }
    })
    req.user.enabled = enabled
  }
  res.send({
    status: 0,
    result
  })
}
