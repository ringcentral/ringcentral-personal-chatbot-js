/**
 * handle webhook
 */

import _ from 'lodash'
import { User, subscribeInterval } from '../models/ringcentral'
import onAddPost from '../handlers/on-add-post'

async function run (props, conf, funcName) {
  const { skills } = conf
  let handled = false
  for (let skill of skills) {
    if (skill[funcName]) {
      let prev = await skill[funcName]({
        ...props,
        shouldUseSignature: conf.shouldUseSignature,
        handled
      })
      handled = handled || prev
    }
  }
  await conf[funcName]({
    ...props,
    handled
  })
}

export default (conf) => {
  return async (req, res) => {
    let message = req.body
    console.log('message', message)
    let isRenewEvent = _.get(message, 'event') === subscribeInterval()
    let userId = (_.get(message, 'body.extensionId') || _.get(message, 'ownerId') || '').toString()
    if (!userId) {
      res.set({
        'validation-token': req.get('validation-token') || req.get('Validation-Token')
      })
      return res.send('ok')
    }
    let user = await User.findOne({
      where: {
        id: userId
      }
    })
    if (isRenewEvent) {
      // get reminder event, do token renew and subscribe renew
      if (user && isRenewEvent) {
        console.log(new Date().toString(), 'receive renew event, user id', userId)
        await user.refresh()
        await user.ensureWebHook()
      }
    }
    let eventType = _.get(message, 'body.eventType')
    let shouldUseSignature = !!_.get(user, 'signed')
    let currentConf = {
      ...conf,
      shouldUseSignature
    }
    if (eventType === 'PostAdded') {
      const result = await onAddPost(message, currentConf, shouldUseSignature)
      if (result) {
        await run({ type: 'Message4Bot', ...result }, currentConf, 'onPostAdd')
      }
    }
    await run({ eventType, message, user }, conf, 'onEvent')
    res.set({
      'validation-token': req.get('validation-token') || req.get('Validation-Token')
    })
    res.send('WebHook got')
  }
}
