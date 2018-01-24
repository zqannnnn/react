import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Offer } from '../models/offer'
import { User } from '../models/user';
import { consts } from '../config/static';
const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const offer = new Offer({
      userId: req.userId
    })
    await offer.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.route('/:offerId')
  .get(async (req: express.Request, res: express.Response) => {
    const offer = await Offer.find({ where: { id: req.params.offerId } })
    if (!offer) {
      return res.status(403).send({error: 'Offer does not exist'})
    }
    return res.send(offer)
  })
  .put(async (req: express.Request, res: express.Response) => {
    try {
      const offer = await Offer.find({ where: { id: req.params.offerId } })
      if (!offer) {
        return res.status(500).send({error: 'Offer does not exist'})
      }
      Object.keys(req.body).forEach((key: string) => offer[key] = req.body[key])
      offer.save()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
  .delete(async (req: express.Request, res: express.Response) => {
    try {
      const offer = await Offer.find({ where: { id: req.params.offerId } })
      if (!offer) {
        return res.status(500).send({error: 'Offer does not exist'})
      }
      offer.status = consts.OFFER_STATUS_CANCELLED
      offer.save();
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
router.get('/list', async (req:Request, res:express.Response) => {
  let offers
  if(req.query&&req.query.type==='my'){
    offers = await Offer.findAll({
      where:{
        userId: req.userId,
        status:consts.OFFER_STATUS_CREATED
      }
    })
  }else{
    offers = await Offer.findAll({
      where:{
        status:consts.OFFER_STATUS_CREATED
      }
    })
  }
  
  return res.send(offers)
})

export = router