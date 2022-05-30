/**
 * renew all rc tokens task
 * should have a limit or may take too long
 */

import { User } from '../models/ringcentral'
import { maintain } from '../common/maintain'

// const deadline = 1000 * 60 * 60 * 24 * 90
const limit = parseInt(process.env.RENEW_LIMIT, 10)

const expire = 3600 * 1000 - 60 * 1000

export async function refreshUser (user) {
  if (!user.enabled && user.turnOffDesc === 'self') {
    console.log('user id', user.id, 'turn it off by self, no refresh token')
    return false
  }
  const now = Date.now()
  const update = +new Date(user.lastRefreshTime)
  // console.log('update time', update)
  // console.log('expire', expire)
  // console.log('now', now)
  if (now - update >= expire) {
    console.log('refresh token for', user.id)
    await user.refresh()
  }
  if (!user.enabled && user.turnOffDesc !== 'self') {
    await user.ensureWebHook()
  }
  return user
}

// function notUsedForSomeTime (inst) {
//   const now = Date.now()
//   return now - (inst.lastUseTime || now) > deadline
// }

function nextTask (lastKey) {
  console.log('send next renew request', lastKey)
  // const url = `${process.env.RINGCENTRAL_APP_SERVER}/admin/renew-token?db=${db}&lastKey=${lastKey}`
  // axios.put(
  //   url,
  //   undefined,
  //   {
  //     auth: {
  //       username: process.env.RINGCENTRAL_ADMIN_USERNAME,
  //       password: process.env.RINGCENTRAL_ADMIN_PASSWORD
  //     }
  //   }
  // )
  return maintain({
    lastKey,
    app: 'maintain'
  })
}

export default async function renew (req, res) {
  const {
    lastKey
  } = req.query
  const q = {
    limit
  }
  if (lastKey) {
    q.lastKey = {
      id: lastKey
    }
  }
  console.log('running renew task')
  const users = await User.findAll(q)
  console.log('authed rc users:', users.length)
  let i = 1
  for (const user of users) {
    console.log(i, 'user', user.id)
    await refreshUser(user).catch(console.error)
    i++
  }
  if (users.lastKey) {
    await nextTask(users.lastKey.id)
  }
  res.send('ok')
}

// trigger by native lambda event
export function triggerMaintain (event) {
  console.log('event- for maintain---', event)
  return new Promise((resolve, reject) => {
    const {
      lastKey
    } = event
    const req = {
      query: {
        lastKey
      }
    }
    const res = {
      send: resolve
    }
    renew(req, res)
  })
}
