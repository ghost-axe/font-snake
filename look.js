var fs = require('fs')
var path = require('path')
function travelFiles(fPath, ext, cb){
  var filePath = path.resolve(fPath)
  fs.readdir(filePath,function(err,files){
    if(err){
      console.warn(err)
    }else{
      files.forEach(function(filename){
        var filedir = path.join(filePath, filename)
        fs.stat(filedir,function(eror, stats){
          if(eror){
            console.warn('获取文件stats失败')
          }else{
            var isFile = stats.isFile()
            var isDir = stats.isDirectory()
            if(isFile){
              if (path.extname(filedir) == ext) {
                console.log('parsing ' + filename + '......')
                var content = fs.readFileSync(filedir, 'utf-8')
                cb(content)
              }
            }
            if(isDir){
              travelFiles(filedir, ext, cb)
            }
          }
        })
      })
    }
  })
}

module.exports = travelFiles
