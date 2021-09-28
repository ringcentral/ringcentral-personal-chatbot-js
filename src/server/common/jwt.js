/**
 * jwt middlewares
 */

import jwt from 'express-jwt'
import jwtSign from 'jsonwebtoken'

const secret = process.env.SERVER_SECRET

export const errHandler = function (err, req, res, next) {
  if (err && err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  } else {
    next()
  }
}

export const jwtCreate = () => {
  return jwt({
    secret,
    algorithms: ['HS256']
  })
}

export const sign = (id) => {
  return jwtSign.sign({
    id
  }, secret, { expiresIn: '120y' })
}
