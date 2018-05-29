const fs = require('fs')
const path = require('path')
let glob = require('glob')
let parser = require('typescript-react-intl').default
let targetFolder = 'translation'

//for mkdir recursive
//from https://stackoverflow.com/a/40686853
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      fs.mkdirSync(curDir)
      console.log(`Directory ${curDir} created!`)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
      console.log(`Directory ${curDir} already exists!`)
    }

    return curDir
  }, initDir)
}

function runner(pattern, cb) {
  let results = []
  pattern = pattern || 'frontend/**/*.@(tsx|ts)'
  //get all file paths according to the pathern
  glob(pattern, function(err, files) {
    if (err) {
      throw new Error(err)
    }
    files.forEach(f => {
      let contents = fs.readFileSync(f).toString()
      //generate messages
      let res = parser(contents)
      if (res.length > 0) {
        res.map(r => {
          //set file path for every objects
          r.filepath = f
        })
        results.push(res)
      }
    })
    cb && cb(results)
  })
}

runner(null, function(results) {
  let filePath = ''
  const sep = path.sep
  let targetDir = ''
  let fileName = ''
  let targetPath = ''
  results.forEach(result => {
    filePath = targetFolder + sep + result[0].filepath
    targetDir = filePath.slice(0, filePath.lastIndexOf(sep))
    fileName = filePath.slice(
      filePath.lastIndexOf(sep),
      filePath.lastIndexOf('.')
    )
    targetPath = targetDir + fileName + '.json'
    mkDirByPathSync(targetDir, true)
    fs.writeFileSync(targetPath, `${JSON.stringify(result, null, 2)}\r`)
    console.log(`Target file: ${targetPath} created!`)
  })
})
