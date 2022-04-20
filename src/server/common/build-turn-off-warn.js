import {
  buildLoginUrlRedirect
} from './constants'

export default async function buildOffMessage (user) {
  let warn = ''
  if (user && !user.enabled) {
    const url = await buildLoginUrlRedirect()
    warn = user.turnOffDesc === 'self'
      ? 'You have disabled auto reply.'
      : 'Renew token failure caused auto reply turned off.'
    warn = `\n${warn} You can [click to enable auto reply](${url})\n`
  }
  return warn
}
