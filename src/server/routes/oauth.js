import { User } from '../models/ringcentral'
import copy from 'json-deep-copy'
import { pack, jwtPrefix, extraPath } from '../common/constants'
import { sign } from '../common/jwt'

const { SERVER_HOME = '/' } = process.env

export default async (req, res) => {
  const { code, state } = req.query
  let { user, existInDB } = await User.init({ code, state })
  if (state === 'user' || !existInDB) {
    await user.ensureWebHook()
  }
  let { id } = user
  const token = sign(id)
  let red = state.startsWith('redirect=')
    ? decodeURIComponent(state.replace(/^redirect=/, ''))
    : extraPath + SERVER_HOME
  let data = {
    redirect: red,
    title: pack.name,
    jwtPrefix,
    token
  }
  data._global = copy(data)
  res.render('auth', data)
}
