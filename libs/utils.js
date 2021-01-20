const fs = require('fs')
const path = require('path')
const less = require('less')
const sass = require('node-sass')
const renderStyl = require('./renderStyl')
const css2json = require('css2json')
const Fontmin = require('fontmin');
const rename = require('gulp-rename');

let options = {
  option: null,
  set: function (val) {
    this.option = val
  }
}

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

async function findFont (styleStr, styleVars, cb) {
  let option = options.option
  let rStr = styleVars + styleStr

  if (rStr) {
    let output
    let cssJson
    if (!option.preProcessor) {
      cssJson = css2json(rStr)
    } else {
      switch (option.preProcessor) {
        case 'less':
          output = await less.render(rStr)
          cssJson = css2json(output.css)
          break
        case 'scss':
          output = sass.renderSync({
            data: rStr
          })
          cssJson = css2json(output.css + '')
          break
        case 'styl':
          output = renderStyl(rStr)
          cssJson = css2json(output)
          break
      }
    }
    for (let key in cssJson) {
      let item = cssJson[key]
      if (item['font-family'] && item['font-family'] == option.fontName) {
        cb(key)
      }
    }
  }
}

function minFont (text, doneCb) {
  let option = options.option

  let fontFilePath = option.fontFilePath
  console.log('compressing......')
  let fileName = path.basename(fontFilePath)
  let fileDir = fontFilePath.replace(fileName, '')
  fileDir = fileDir.substr(0, fileDir.length - 1)
  let backupFilePath = fontFilePath.replace(fileName, 'backup-' + fileName)

  if (!fs.existsSync(backupFilePath)) {
    fs.writeFileSync(backupFilePath, fs.readFileSync(fontFilePath))
  }
  if (fs.existsSync(fontFilePath)) {
    fs.unlinkSync(fontFilePath)
  }

  var fontMin = new Fontmin()
    .src(backupFilePath)
    .dest(fileDir)
    .use(rename(fileName))
    .use(Fontmin.glyph({
      text: text,
      hinting: false
    }));

  fontMin.run((err, files) => {
    if (err) {
      console.error(err)
      return
    }
    console.log("\033[1A\033[K\033[1A")
    console.log("\033[40;34m字体压缩完成\033[0m")
    doneCb()
  });
}

function collectText (node) {
  let str = ''
  function loop (root) {
    if (root.rawText) {
      str += root.rawText
      return
    } else if (root.childNodes) {
      root.childNodes.forEach(c => loop(c))
    }
  }
  loop(node)
  return str
}

module.exports = { options, travelFiles, collectText, findFont, minFont }
