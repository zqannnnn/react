import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Category } from '../models'

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req: express.Request, res: express.Response) => {
  const categorys = await Category.findAll({
    attributes: ['type', 'details']
  })

  return res.send(categorys)
})

export = router
