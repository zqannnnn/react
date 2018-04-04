import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Offer,User,Image } from '../models'
import { consts } from '../config/static';
const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string;
  isAdmin:boolean;
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const offer = new Offer({
      userId: req.userId,
      ...req.body
    })
    await offer.save()
    if(req.body.images){
      req.body.images.forEach((image: {path:string}) => {
        const imageDb = new Image({
          path: image.path,
          offerId: offer.id
        })
        imageDb.save()
      });
    }
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/list', async (req:Request, res:express.Response) => {
  let offers;
  let selectType = req.query.selectType;
  try {
    if(selectType==='mine'){
      offers = await Offer.findAll({
        where:{
          userId:req.userId
        },
        include:[{model:Image,attributes:['path']}]
      })
    }else if (selectType==='finished'){
      offers = await Offer.findAll({
        where:{
          status:consts.OFFER_STATUS_FINISHED
        },
        include:[{model:Image,attributes:['path']}]
      })
    }else{
      offers = await Offer.findAll({
        where:{
          status:consts.OFFER_STATUS_CREATED
        },
        include:[{model:Image,attributes:['path']}]
      })
    }
    return res.send(offers)
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})
router.get('/finish/:offerId', async (req: Request, res: express.Response) => {
  try {
    if(!req.isAdmin){
      return res.status(500).send({error: 'Permission denied.'})
    }
    const offer = await Offer.find({ where: { id: req.params.offerId } })
    if (!offer) {
      return res.status(500).send({error: 'Offer does not exist'})
    }
    offer.status = consts.OFFER_STATUS_FINISHED
    offer.save();
    return res.send({success: true})
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})
router.route('/:offerId')
  .get(async (req: express.Request, res: express.Response) => {
    const offer = await Offer.find({ where: { id: req.params.offerId },
      include:[{model:Image,attributes:['path']}] 
    })
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
      await Image.destroy({where:{offerId:req.params.offerId}})
      if(req.body.images){
        req.body.images.forEach((image: {path:string}) => {
          const imageDb = new Image({
            path: image.path,
            offerId: offer.id
          })
          imageDb.save()
        });
      }
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


export = router