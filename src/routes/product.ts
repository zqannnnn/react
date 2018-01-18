import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Product } from '../models/product'
import { User } from '../models/user';

const router = express.Router()

router.use(authMiddleware)


router.get('/', async (req:express.Request, res:express.Response) => {
  let productOptions = await Product.findAll({
    attributes:['type','options']
  })
  
  return res.send(productOptions)
})

export = router