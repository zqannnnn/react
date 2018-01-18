import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Order } from '../models/order'
import { User } from '../models/user';

const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const order = new Order({
      userId: req.userId
    })
    await order.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.route('/:orderId')
  .get(async (req: Request, res: express.Response) => {
    const order = await Order.find({ where: { id: req.params.orderId } })
    if (!order) {
      return res.status(403).send({error: 'Order does not exist'})
    }
    return res.send(order)
  })
  .put(async (req: Request, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if(order&&order.userId!=req.userId){
        return res.status(500).send({error: 'Permission denied'})
      }
      if (!order) {
        return res.status(500).send({error: 'Order does not exist'})
      }
      Object.keys(req.body).forEach((key: string) => order[key] = req.body[key])
      order.save()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
  .delete(async (req: Request, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if(order&&order.userId!=req.userId){
        return res.status(500).send({error: 'Permission denied'})
      }
      if (!order) {
        return res.status(500).send({error: 'Order does not exist'})
      }
      order.destroy()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
router.get('/list', async (req:Request, res:express.Response) => {
  let orders = await Order.findAll({
    where:{
      userId: req.userId
    }
  })
  return res.send(orders)
})

export = router