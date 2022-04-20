/**
 * handle webhook
 */

import _ from 'lodash'
import { User, subscribeInterval } from '../models/ringcentral'
import onAddPost from '../handlers/on-add-post'

async function run (props, conf, funcName) {
  const { skills } = conf
  let handled = false
  for (const skill of skills) {
    if (skill[funcName]) {
      const prev = await skill[funcName]({
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
    const message = req.body
    if (process.env.DEBUG_ON) {
      console.log('get rc webhook', JSON.stringify(message, null, 2))
    }
    const isRenewEvent = _.get(message, 'event') === subscribeInterval()
    const userId = (_.get(message, 'body.extensionId') || _.get(message, 'ownerId') || '').toString()
    if (!userId) {
      res.set({
        'validation-token': req.get('validation-token') || req.get('Validation-Token')
      })
      return res.send('ok')
    }
    const user = await User.findByPk(userId)
    if (isRenewEvent && user) {
      // console.log(new Date().toString(), 'receive renew event, user id', userId)
      await user.ensureWebHook()
      return
    }
    const eventType = _.get(message, 'body.eventType')
    const shouldUseSignature = !!_.get(user, 'signed')
    const currentConf = {
      ...conf,
      user,
      shouldUseSignature
    }
    if (eventType === 'PostAdded') {
      const result = await onAddPost(message, currentConf)
      if (result) {
        await run({ type: 'Message4Bot', ...result }, currentConf, 'onPostAdd')
      }
    }
    await run({ eventType, message, user }, currentConf, 'onEvent')
    res.set({
      'validation-token': req.get('validation-token') || req.get('Validation-Token')
    })
    res.send('WebHook got')
  }
}
