import { User } from '../models/ringcentral'
import _ from 'lodash'

const { SERVER_HOME = '/' } = process.env

export default async (req, res) => {
  const { code, state } = req.query
  let { user, existInDB } = await User.init({ code, state })
  if (state === 'user' || !existInDB) {
    await user.ensureWebHook()
  }
  let u = user.toJSON()
  req.session.user = _.pick(u, ['id', 'email', 'name', 'signed', 'enabled'])
  res.redirect(SERVER_HOME)
}
