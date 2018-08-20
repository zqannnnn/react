import * as express from 'express'
import * as i18n from 'i18next'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Consignee } from '../models/'
const router = express.Router()
router.use(authMiddleware)
router.use(loginCheckMiddleware)
router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const consignee = new Consignee({
      userId: req.userId,
      ...req.body
    })
    await consignee.save()

    return res.send(consignee)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router
  .route('/:consigneeId')
  .put(async (req: IRequest, res: express.Response) => {
    try {
      const consignee = await Consignee.find({
        where: {
          id: req.params.consigneeId
        }
      })
      if (!consignee) {
        return res
          .status(500)
          .send({ error: i18n.t('consignee does not exist.') })
      }
      Object.keys(req.body).forEach(
        (key: string) => (consignee[key] = req.body[key])
      )
      consignee.save()

      return res.send(consignee)
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })
  .delete(async (req: IRequest, res: express.Response) => {
    try {
      const consignee = await Consignee.find({
        where: {
          id: req.params.consigneeId
        }
      })
      if (!consignee) {
        return res
          .status(500)
          .send({ error: i18n.t('Consignee does not exist...') })
      }
      const result = await Consignee.destroy({
        where: {
          id: req.params.consigneeId
        }
      })
      if (result > 0) {
        return res.send({ success: true })
      }
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })
export { router }
