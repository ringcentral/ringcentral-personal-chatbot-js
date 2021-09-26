/**
 * renew all rc tokens task
 * should have a limit or may take too long
 */

import { User as RingCentralUser } from '../models/ringcentral'
import { refreshRcUser } from '../common/refresh-user'
// import axios from 'axios'
// import delay from 'timeout-as-promise'
import { maintain } from '../common/maintain'

const deadline = 1000 * 60 * 60 * 24 * 300
const limit = parseInt(process.env.RENEW_LIMIT, 10)

function notUsedForSomeTime (inst) {
  const now = Date.now()
  return now - (inst.lastUseTime || now) > deadline
}

function nextTask (db, lastKey) {
  console.log('send next renew request', db, lastKey)
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
    db,
    lastKey,
    app: 'maintain'
  })
}

export default async function renew (req, res) {
  const {
    lastKey,
    db,
    force
  } = req.query
  const q = {
    limit
  }
  if (lastKey) {
    q.lastKey = {
      id: { S: lastKey }
    }
  }
  console.log('running renew task, limit', limit)
  if (db === 'rc') {
    const users = await RingCentralUser.findAll(q)
    console.log('authed rc users:', users.length)
    let i = 1
    for (const user of users) {
      if (notUsedForSomeTime(user)) {
        console.log(user.id, 'not used for 90 days')
      } else {
        console.log(i, 'user', user.id)
        await refreshRcUser(user, force).catch(console.error)
        i++
      }
    }
    if (users.lastKey) {
      await nextTask(db, users.lastKey.id.S)
    }
  }
  res.send('ok')
}

// trigger by native lambda event
export function triggerMaintain (event) {
  console.log('event- for maintain---', event)
  return new Promise((resolve, reject) => {
    const {
      lastKey,
      db,
      force
    } = event
    const req = {
      query: {
        lastKey,
        db,
        force
      }
    }
    const res = {
      send: resolve
    }
    renew(req, res)
  })
}
