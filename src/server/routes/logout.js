import prefix from '../common/extra-path'
const { SERVER_HOME = '/' } = process.env

export default async (req, res) => {
  req.session.destroy()
  res.redirect(prefix + SERVER_HOME)
}
