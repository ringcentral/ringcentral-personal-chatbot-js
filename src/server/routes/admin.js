
import { User } from '../models/ringcentral'

// create database tables if not exists
export const initDb = async (req, res) => {
  await User.sync()
  res.send('ok')
}

// create database tables if not exists
export const viewDb = async (req, res) => {
  const users = await User.findAll()
  res.send(users)
}

export const renewToken = async (req, res) => {
  const users = await User.findAll()
  let result = ''
  console.log('running renew task')
  for (const user of users) {
    if (user.enabled) {
      await user.refresh()
    }
  }
  res.send(result)
}
