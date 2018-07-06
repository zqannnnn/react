import * as express from 'express'
import * as i18n from 'i18next'
import { consts } from '../config/static'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Goods, Image } from '../models/'
const router = express.Router()

router.use(authMiddleware)
router.use(loginCheckMiddleware)

router.get('/list', async (req: IRequest, res: express.Response) => {
  const page = Number(req.query.page)
  const pageSize = Number(req.query.pageSize)
  const keyword = req.query.keyword
  const sorting = req.query.sorting
  const whereOption: {
    ownerId?: string
    status?: number
    title?: { $like: string }
    category?: number
  } = {}
  const pageOption: {
    offset?: number
    limit?: number
  } = {}

  let orderOption: string[] = ['createdAt', 'DESC']

  if (pageSize && typeof page !== 'undefined') {
    pageOption.offset = (page - 1) * pageSize
    pageOption.limit = (page - 1) * pageSize + pageSize
  }
  if (typeof keyword !== 'undefined') {
    whereOption.title = { $like: `%${keyword}%` }
  }
  if (sorting === 'new') {
    orderOption = ['createdAt', 'DESC']
  } else if (sorting === 'old') {
    orderOption = ['createdAt', 'ASC']
  }
  try {
    const result = await Goods.findAndCount({
      where: {
        ...whereOption
      },
      include: [
        {
          model: Image,
          attributes: ['path', 'type']
        }
      ],
      ...pageOption,
      order: [orderOption]
    })
    return res.send({ goods: result.rows, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const goods = new Goods({
      creatorId: req.userId,
      ownerId: req.userId,
      ...req.body
    })
    await goods.save()
    if (req.body.images) {
      req.body.images.forEach((image: { path: string }) => {
        const imageDb = new Image({
          path: image.path,
          goodsId: goods.id,
          type: consts.IMAGE_TYPE_MEDIA
        })
        imageDb.save()
      })
    }
    if (req.body.certificates) {
      req.body.certificates.forEach((certificate: { path: string }) => {
        const imageDb = new Image({
          path: certificate.path,
          goodsId: goods.id,
          type: consts.IMAGE_TYPE_CERTIFICATE
        })
        imageDb.save()
      })
    }
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router
  .route('/:goodsId')
  .get(async (req: express.Request, res: express.Response) => {
    const goods = await Goods.find({
      where: {
        id: req.params.goodsId
      },
      include: [
        {
          model: Image,
          attributes: ['path', 'type']
        }
      ]
    })
    if (!goods) {
      return res.status(403).send({ error: i18n.t('goods does not exist.') })
    }
    return res.send(goods)
  })
  .put(async (req: IRequest, res: express.Response) => {
    try {
      const goods = await Goods.find({
        where: {
          id: req.params.goodsId
        }
      })
      if (
        goods &&
        goods.ownerId !== req.userId &&
        goods.creatorId !== req.userId &&
        !req.isAdmin
      ) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      if (!goods) {
        return res.status(500).send({ error: i18n.t('goods does not exist.') })
      }
      Object.keys(req.body).forEach(
        (key: string) => (goods[key] = req.body[key])
      )
      goods.save()
      await Image.destroy({
        where: {
          goodsId: req.params.goodsId
        }
      })
      if (req.body.images) {
        req.body.images.forEach((image: { path: string }) => {
          const imageDb = new Image({
            path: image.path,
            goodsId: goods.id,
            type: consts.IMAGE_TYPE_MEDIA
          })
          imageDb.save()
        })
      }
      if (req.body.certificates) {
        req.body.certificates.forEach((certificate: { path: string }) => {
          const imageDb = new Image({
            path: certificate.path,
            goodsId: goods.id,
            type: consts.IMAGE_TYPE_CERTIFICATE
          })
          imageDb.save()
        })
      }
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })
  .delete(async (req: IRequest, res: express.Response) => {
    try {
      const goods = await Goods.find({
        where: {
          id: req.params.goodsId
        }
      })
      if (goods && goods.userId !== req.userId && !req.isAdmin) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      if (!goods) {
        return res.status(500).send({ error: i18n.t('Goods does not exist.') })
      }
      const result = await Goods.destroy({
        where: {
          id: req.params.goodsId
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
