import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Currency } from '../models/'

const router = express.Router()

router.get('/', async (req:express.Request, res:express.Response) => {
  let currencys = await Currency.findAll({
    attributes:['id','currency']
  })
  
  return res.send(currencys)
})

export = router