/**
 * view index
 */

import copy from 'json-deep-copy'
import { resolve } from 'path'
import { User } from '../models/ringcentral'

const cwd = process.cwd()
const pack = require(resolve(cwd, 'package.json'))
const inst = new User()

export default (req, res) => {
  let { id, user } = req.session
  let data = {
    version: pack.version,
    title: pack.name,
    sessionId: id,
    user: user || null,
    authUrl: inst.authorizeUri(id)
  }
  data._global = copy(data)
  res.render('index', data)
}
