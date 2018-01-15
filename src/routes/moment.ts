import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Moment } from '../models'
import { Screenshot } from '../models/screenshot';
import { User } from '../models/user';

const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const moment = new Moment({
      userId: req.userId,
      commentNumber: req.body.commentNumber,
      heartNumber: req.body.heartNumber,
      momentAt: req.body.momentAt,
    })
    await moment.save()
    req.body.screenshots.forEach((path: string) => {
      const screenshot = new Screenshot({
        path: path,
        momentId: moment.id
      })
      screenshot.save()
    });
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/list', async (req, res) => {
  const moments = await Moment.findAll({
    include: [User, Screenshot]
  })
  return res.send(moments)
})

export = router