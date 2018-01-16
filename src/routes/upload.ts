import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import * as fs from 'fs'
import * as multer from 'multer'
import { makeRandomString } from '../util'
const router = express.Router()
router.use(authMiddleware)

const upload = multer({ dest: 'uploads/' })

function makeRandomName(originalname:string) {
    var name = makeRandomString(8);
    const arry = originalname.split('.');
    name += '.'+arry[arry.length-1]
    return name;
  }

router.post('/image', upload.single('image'), 
    async (req: express.Request, res: express.Response) =>{
    //console.log(req.file);
    const fileName = makeRandomName(req.file.originalname)
    fs.rename(req.file.path, "uploads/"+fileName, (err)=>{
        if(err)
            return res.status(500).send({error: err})
        else
            return res.send({path:"/static/"+fileName})
        }
    )
})

export = router