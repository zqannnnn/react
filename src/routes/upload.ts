import * as express from 'express'
import * as fs from 'fs'
import * as multer from 'multer'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { makeRandomString } from '../util'
const router = express.Router()
router.use(authMiddleware)
router.use(loginCheckMiddleware)
const upload = multer({ dest: 'uploads/' })

function makeRandomName(originalname: string) {
  let name = makeRandomString(8)
  const arry = originalname.split('.')
  name += '.' + arry[arry.length - 1]
  return name
}

router.post(
  '/image',
  upload.single('file'),
  async (req: express.Request, res: express.Response) => {
    const fileName = makeRandomName(req.file.originalname)
    fs.rename(req.file.path, 'uploads/' + fileName, err => {
      if (err) {
        return res.status(500).send({ error: err })
      } else {
        return res.send({ path: '/static/' + fileName })
      }
    })
  }
)

export { router }
