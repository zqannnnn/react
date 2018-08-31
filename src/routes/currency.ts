import * as express from 'express'
import { Currency } from '../models/'
const router = express.Router()
router.get('/list', async (req: express.Request, res: express.Response) => {
  try {
    const currencies = await Currency.findAll({})
    return res.send(currencies)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
export { router }
