const fs = require('fs')
const path = require('path')

async function travelFiles(basePath, ext, cb){
  let filePath = path.resolve(basePath)
  let files = fs.readdirSync(filePath)
  if (files.length == 0) {
    console.log("\033[41;30m ERROR \033[40;31m No " + ext + " file\033[0m")
    return
  }
  for (let i = 0; i < files.length; i++) {
    let filename = files[i]
    let filedir = path.join(filePath, filename)
    let fileStat = fs.statSync(filedir)
    if(fileStat.isFile()){
      if (path.extname(filedir) == ext) {
        console.log('parsing file: ' + filename)
        console.log("\033[1A\033[K\033[1A")
        var content = fs.readFileSync(filedir, 'utf-8')
        if (cb instanceof Promise) {
          await cb(content)
        } else {
          cb(content)
        }
      }
    } else if(fileStat.isDirectory()){
      await travelFiles(filedir, ext, cb)
    }
  }
}

module.exports = travelFiles
