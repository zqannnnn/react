import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { consts } from '../config/static'

// TODO use the User model to identify if user is logged in or not, not the JWT

interface IDecodedObject {
  userType: number
  id: string
}

// our middleware adds some stuff
interface Request extends express.Request {
  isAdmin: boolean
  userId: string
}

export const authMiddleware = (req: Request, res: express.Response, next: express.NextFunction) => {
  const bearerHeader = req.header('authorization')
  if (typeof bearerHeader === 'string') {
    const token = bearerHeader.split(' ')[1]
    if (typeof token === 'string') {
      return jwt.verify(token, req.app.get('secretKey'), (err: jwt.JsonWebTokenError, decoded: IDecodedObject) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).send('TokenExpiredError')
          } else {
            return res.status(401).send('JsonWebTokenError')
          }
        }
        if (decoded.userType === consts.USER_TYPE_ADMIN) {
          req.isAdmin = true
        } else {
          req.isAdmin = false
        }
        req.userId = decoded.id;
        next()
      })
    }
  }
  return res.status(403).send({ success : false, message: 'Please log in before this operation' })
}
