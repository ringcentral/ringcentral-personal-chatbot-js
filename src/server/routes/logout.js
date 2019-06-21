import { pack, jwtPrefix, extraPath } from '../common/constants'
import copy from 'json-deep-copy'

const { SERVER_HOME = '/' } = process.env

export default async (req, res) => {
  let data = {
    redirect: extraPath + SERVER_HOME,
    title: pack.name,
    jwtPrefix
  }
  data._global = copy(data)
  res.render('logout', data)
}
