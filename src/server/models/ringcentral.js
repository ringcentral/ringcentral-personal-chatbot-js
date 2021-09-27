/**
 * User class
 */

import RingCentral from 'ringcentral-js-concise'
import { Service } from './Service'

export const subscribeInterval = () => '/restapi/v1.0/subscription/~?threshold=120&interval=35'

export class User extends Service {}

User.init = async ({ code, state }) => {
  const rc = new RingCentral(
    process.env.RINGCENTRAL_CLIENT_ID,
    process.env.RINGCENTRAL_CLIENT_SECRET,
    process.env.RINGCENTRAL_SERVER
  )
  await rc.authorize({
    code,
    redirectUri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/rc/oauth'
  })
  const token = rc.token()
  const id = token.owner_id
  let where = {
    id
  }
  let user = await User.findByPk(id)
  let existInDB = !!user
  const now = Date.now()
  let update = {
    token,
    tokenUpdateTime: now,
    lastUseTime: now
  }
  if (user) {
    if (state === 'user') {
      update.enabled = true
    }
    await User.update(update, {
      where
    })
    Object.assign(user, update)
    return { user, existInDB }
  } else {
    user = await User.create({
      id,
      ...update
    })
  }
  return { user, existInDB }
}

Object.defineProperty(User.prototype, 'rc', {
  get: function () {
    const rc = new RingCentral(
      process.env.RINGCENTRAL_CLIENT_ID,
      process.env.RINGCENTRAL_CLIENT_SECRET,
      process.env.RINGCENTRAL_SERVER
    )
    if (this.token) {
      rc.token(this.token)
    }
    return rc
  }
})

User.prototype.authorizeUri = function (state = 'hoder') {
  return this.rc.authorizeUri(process.env.RINGCENTRAL_CHATBOT_SERVER + '/rc/oauth', {
    state,
    responseType: 'code'
  })
}

User.prototype.removeWebHook = function () {
  return this.ensureWebHook(true)
}

User.prototype.refresh = async function () {
  try {
    let { rc } = this
    await rc.refresh()
    let token = rc.token()
    await User.update({
      token
    }, {
      where: {
        id: this.id
      }
    })
    this.token = token
    return true
  } catch (e) {
    console.log('User refresh token', e)
    await User.destroy({
      where: {
        id: this.id
      }
    })
    console.log(`User ${this.id} refresh token has expired`)
    return false
  }
}

User.prototype.getGroup = async function (groupId) {
  try {
    const r = await this.rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
    return r.data
  } catch (e) {
    if (e.status === 404) {
      return undefined
    }
    throw e
  }
}

User.prototype.sendMessage = async function (groupId, messageObj) {
  const r = await this.rc.post(`/restapi/v1.0/glip/groups/${groupId}/posts`, messageObj)
  let mark = await this.markAsUnread(groupId).catch(e => {
    console.log(e.stack)
  })
  return {
    sendResult: r.data,
    markAsUnreadResult: mark
  }
}

User.prototype.markAsUnread = async function (groupId) {
  const r = await this.rc.post(`restapi/v1.0/glip/chats/${groupId}/unread`)
  return r.data
}
