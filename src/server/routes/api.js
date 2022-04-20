/**
 * bot control apis
 * /api
 */

import { User } from '../models/ringcentral'
import _ from 'lodash'

const supportedActions = [
  'bot-signature-switch',
  'bot-switch',
  'get-user',
  'switch-reply-without-mention-in-team'
]

const validProps = [
  'id',
  'name',
  'firstName',
  'lastName',
  'email',
  'enabled',
  'signed',
  'privateChatOnly',
  'lastUseTime',
  'tokenUpdateTime',
  'data'
]

export default async (req, res) => {
  const { user } = req
  if (!user) {
    res.status(401)
    return res.send('please login first')
  }
  const { body = {} } = req
  const {
    action,
    update
  } = body
  if (!supportedActions.includes(action)) {
    res.status(400)
    return res.send('not supported')
  }
  const { id } = user
  let result
  if (action === 'get-user') {
    result = await User.findByPk(id).catch(console.error)
    result = _.pick(result || {}, validProps)
    if (_.isEmpty(result)) {
      res.status(401)
      return res.send('user not exist')
    }
  } else if (action === 'bot-signature-switch') {
    result = await User.update({
      signed: update.signed
    }, {
      where: {
        id
      }
    }).catch(console.error)
  } else if (action === 'bot-switch') {
    const enabled = !!update.enabled
    const user = await User.findByPk(id).catch(console.error)
    if (enabled || !user) {
      res.status(401)
      return res.send('user not find')
    }
    if (user.enabled && !enabled) {
      await user.ensureWebHook(true)
    }
    result = user
  } else if (action === 'switch-reply-without-mention-in-team') {
    const enabled = !!update
    const user = await User.findByPk(id).catch(console.error)
    if (!user) {
      res.status(401)
      return res.send('user not find')
    }
    result = await User.update({
      data: {
        ...user.data,
        replyWithoutMentionInTeam: enabled
      }
    }, {
      where: {
        id
      }
    }).catch(console.error)
  }
  res.send({
    status: 0,
    result
  })
}
