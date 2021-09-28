
import { User } from '../models/ringcentral'
import renew from '../handlers/renew-task'
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

export const renewToken = renew
