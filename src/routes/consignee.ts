import * as express from 'express'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Consignee } from '../models/'
const router = express.Router()
router.use(authMiddleware)
router.use(loginCheckMiddleware)
// router.get('/consignee/new', async (req: express.Request, res: express.Response) => {
//   try {
//     const consignees = await Consignee.findAll({})
//     return res.send(consignees)
//   } catch (e) {
//     return res.status(500).send({ error: e.message })
//   }
// })
router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const consignee = new Consignee({
      userId: req.userId,
      ...req.body
    })
    await consignee.save()

    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
export { router }
