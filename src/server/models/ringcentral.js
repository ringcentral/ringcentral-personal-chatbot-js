/**
 * User class
 */

import Sequelize from 'sequelize'
import sequelize from './sequelize'
import delay from 'timeout-as-promise'
import uid from '../common/uid'
import _ from 'lodash'
import { createRc, tokenExpireTime } from '../common/constants'
import buildOffMessage from '../common/build-turn-off-warn'
import {
  sendPrivateMsg
} from '../common/send-msg'

export const subscribeInterval = () => '/restapi/v1.0/subscription/~?threshold=120&interval=35'

export const User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: uid
  },
  name: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  turnOffDesc: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.JSON
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  signed: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  privateChatOnly: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  lastUseTime: {
    type: Sequelize.INTEGER
  },
  tokenUpdateTime: {
    type: Sequelize.INTEGER
  },
  data: { // all other data associcated with this user
    type: Sequelize.JSON
  }
})

User.init = async ({ code, state }) => {
  const rc = await createRc()
  await rc.authorize({
    redirect_uri: rc.redirectUrl,
    code
  }).then(d => d.data)
  const rcToken = rc.token
  const info = await rc.get('/restapi/v1.0/account/~/extension/~')
    .then(r => r.data)
  const rcId = rcToken.owner_id
  let user = await User.findByPk(rcId)
  const now = Date.now()
  const up = {
    enabled: true,
    token: rcToken,
    lastUseTime: now,
    tokenUpdateTime: now,
    name: info.name,
    ..._.pick(info.contact, [
      'firstName',
      'lastName',
      'email'
    ])
  }
  const q = {
    where: {
      id: rcId
    }
  }
  if (!user) {
    user = await User.create({
      id: rcId,
      ...up
    })
  } else {
    Object.assign(user, up)
    await User.update(up, q)
  }
  await user.ensureWebHook()
  return rcId
}

User.prototype.rc = async function () {
  const rc = await createRc()
  if (this.token) {
    rc.token = this.token
  }
  return rc
}

User.prototype.removeWebHook = async function () {
  return this.ensureWebHook(true)
}

User.prototype.ensureWebHook = async function (removeOnly = false) {
  await this.tryRefresh()
  const rc = await this.rc()
  const r = await rc.get('/restapi/v1.0/subscription')
    .then(d => d.data)
    .catch(e => {
      console.log(e, 'list WebHook error')
    })
  if (r && r.records) {
    for (const sub of r.records) {
      if (sub.deliveryMode.address === process.env.RINGCENTRAL_CHATBOT_SERVER + '/rc/webhook') {
        await rc.delete(`/restapi/v1.0/subscription/${sub.id}`)
          .catch(e => {
            console.log(e, 'del WebHook error, id:', sub.id)
          })
      }
    }
  }
  if (!removeOnly) {
    return this.trySetupWebHook()
  }
}

User.prototype.trySetupWebHook = async function () {
  let count = 0
  let done = false
  while (count < 5 && !done) {
    if (count > 0) {
      console.log('retry setup webhook')
    }
    done = await this.setupWebHook()
    count = count + 1
    await delay(1)
  }
  if (!done) {
    await this.turnOff()
  }
}

User.prototype.setupWebHook = async function () {
  await this.tryRefresh()
  const rc = await this.rc()
  return rc.post('/restapi/v1.0/subscription', {
    eventFilters: [
      '/restapi/v1.0/glip/posts',
      '/restapi/v1.0/glip/groups',
      subscribeInterval()
    ],
    expiresIn: 1799,
    deliveryMode: {
      transportType: 'WebHook',
      address: process.env.RINGCENTRAL_CHATBOT_SERVER + '/rc/webhook'
    }
  })
    .then(() => true)
    .catch(async e => {
      console.log('setupWebHook error', e)
    })
}

User.prototype.getSubscriptions = async function () {
  await this.tryRefresh()
  const rc = await this.rc()
  return rc.get('/restapi/v1.0/subscription')
    .then(d => d.data.records)
    .catch(e => {
      console.log('getSubscriptions error', e)
      return []
    })
}

User.prototype.tryRefresh = async function () {
  const now = Date.now()
  const { lastRefreshTime } = this
  // console.log('now', now)
  // console.log('lastRefreshTime', lastRefreshTime)
  // console.log('diff', now - lastRefreshTime)
  // console.log('tokenExpireTime', tokenExpireTime)
  if (now - lastRefreshTime < tokenExpireTime) {
    return false
  }
  return this.refresh()
}

User.prototype.refresh = async function () {
  try {
    const rc = await this.rc()
    await rc.refresh()
    const { token } = rc
    const now = Date.now()
    const up = {
      token,
      lastRefreshTime: now
    }
    await User.update(up, {
      where: {
        id: this.id
      }
    })
    Object.assign(this, up)
    return true
  } catch (e) {
    console.log('User refresh token error', e)
    await this.turnOff()
    console.log(`User ${this.id} refresh token has expired`)
    return false
  }
}

User.prototype.turnOff = async function (groupId) {
  if (!this.enabled) {
    return 1
  }
  const up = {
    enabled: false,
    turnOffDesc: 'fail'
  }
  await User.update(
    up,
    {
      where: {
        id: this.id
      }
    }
  )
  Object.assign(this, up)
  const msg = await buildOffMessage(this)
  await sendPrivateMsg(this, msg)
}

User.prototype.getGroup = async function (groupId) {
  await this.tryRefresh()
  const rc = await this.rc()
  return rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
    .then(d => d.data)
    .catch(e => {
      console.log('get group error', e)
      return null
    })
}

User.prototype.sendMessage = async function (groupId, messageObj) {
  await this.tryRefresh()
  const rc = await this.rc()
  const r = await rc.post(`/restapi/v1.0/glip/groups/${groupId}/posts`, messageObj)
    .then(d => d.data)
    .catch(err => {
      console.log('send msg error', err)
    })
  return {
    sendResult: r
  }
}
