import { User } from '../models/ringcentral'
import _ from 'lodash'

export default async (req, res) => {
  const { code } = req.query
  let { user } = req.session
  if (!user) {
    user = await User.init({ code })
  }
  await user.ensureWebHook()
  let u = user.toJSON()
  req.session.user = _.pick(u, ['id', 'email', 'name', 'signed', 'enabled'])
  res.redirect('/')
}
