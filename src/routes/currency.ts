import * as express from 'express'
import { Currency } from '../models/'

const router = express.Router()

router.get('/', async (req: express.Request, res: express.Response) => {
  const currencys = await Currency.findAll({})

  return res.send(currencys)
})

export = router
