import * as express from 'express'
import { Currency } from '../models/'
const router = express.Router()

router.get('/list', async (req: express.Request, res: express.Response) => {
  try {
    const currencys = await Currency.findAll({})
    return res.send(currencys)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
export = router
