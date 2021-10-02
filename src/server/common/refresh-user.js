
const expireRc = 3600 * 1000 - 60 * 1000

export async function refreshRcUser (user, force) {
  const expire = expireRc
  const now = Date.now()
  const update = +new Date(user.tokenUpdateTime || 0)
  console.log('update time', update)
  console.log('expire', expire)
  console.log('now', now)
  const expired = now - update >= expire
  if (expired || force) {
    console.log('refresh token for', user.id)
    await user.refresh()
  } else {
    console.log('token not expired')
  }
  return user
}
