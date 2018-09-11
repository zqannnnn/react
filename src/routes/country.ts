import * as express from 'express'
import { Country } from '../models/'
const router = express.Router()
router.get('/list', async (req: express.Request, res: express.Response) => {
  try {
    const countries = await Country.findAll({})
    return res.send(countries)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
export { router }
