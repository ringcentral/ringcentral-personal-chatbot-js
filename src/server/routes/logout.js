
const { SERVER_HOME = '/' } = process.env

export default async (req, res) => {
  req.session.destroy()
  res.redirect(SERVER_HOME)
}
