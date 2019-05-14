import { User } from '../models/ringcentral'

export default async (req, res) => {
  let { user } = req.session || {}
  if (user && user.id) {
    let inst = await User.findByPk(user.id)
    if (inst) {
      await inst.removeWebHook()
      await inst.destroy()
    }
  }
  req.session.destroy()
  res.redirect('/')
}
