import { User } from '../models/ringcentral'
import copy from 'json-deep-copy'
import jwt from 'jsonwebtoken'
import { pack, jwtPrefix, extraPath } from '../common/constants'

const { SERVER_HOME = '/', SERVER_SECRET } = process.env

export default async (req, res) => {
  const { code, state } = req.query
  let { user, existInDB } = await User.init({ code, state })
  if (state === 'user' || !existInDB) {
    await user.ensureWebHook()
  }
  let { id } = user
  var token = jwt.sign({
    id
  }, SERVER_SECRET, { expiresIn: '60d' })
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
