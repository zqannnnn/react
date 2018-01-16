import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Product } from '../models/product'
import { User } from '../models/user';

const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const goods = new Product({
      creatorId: req.userId
    })
    await goods.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/list', async (req, res) => {
  const products = await Product.findAll({
    include: [User]
  })
  return res.send(products)
})

export = router