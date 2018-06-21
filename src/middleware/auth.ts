import * as express from 'express'
import * as i18n from 'i18next'
import * as jwt from 'jsonwebtoken'
import { consts } from '../config/static'

// TODO use the User model to identify if user is logged in or not, not the JWT

interface IDecodedObject {
  userType: number
  id: string
}

// our middleware adds some stuff
export interface IRequest extends express.Request {
  isAdmin: boolean
  userId: string
}

export const authMiddleware = (
  req: IRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const bearerHeader = req.header('authorization')
  if (typeof bearerHeader === 'string') {
    const token = bearerHeader.split(' ')[1]
    if (typeof token === 'string') {
      return jwt.verify(
        token,
        req.app.get('secretKey'),
        (err: jwt.JsonWebTokenError, decoded: IDecodedObject) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              return res.status(498).send({
                error: i18n.t('Login has expired, please login again.')
              })
            } else {
              return res.status(401).send({ error: i18n.t('Invalid Token.') })
            }
          }
          if (decoded.userType === consts.USER_TYPE_ADMIN) {
            req.isAdmin = true
          } else {
            req.isAdmin = false
          }
          req.userId = decoded.id
          next()
        }
      )
    }
  }
  return res
    .status(403)
    .send({ error: i18n.t('Please log in before this operation.') })
}
