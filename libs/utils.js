const fs = require('fs')
const path = require('path')
const fileParser = require('node-html-parser').parse
const less = require('less')
const sass = require('node-sass')
const renderStyl = require('./renderStyl')
const css2json = require('css2json')
const Fontmin = require('fontmin')
const rename = require('gulp-rename')

let options = {
  option: null,
  set: function (val) {
    this.option = val
  }
}

let dataStore = {
  collectTextStr: '',
  styleVars: ''
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
        console.log('正在扫描: ' + filename)
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

async function parseStyleVar () {
  let option = options.option

  if (option.preProcessor && option.styleVarDir) {
    await travelFiles(option.styleVarDir,`.${option.preProcessor}`, content => {
      dataStore.styleVars = dataStore.styleVars + '\r\n' + content + '\r\n'
    })
  }
}

async function parseVueFile () {
  let option = options.option

  await travelFiles(option.basePath, '.vue', async function (content) {
    let reContent = content.replace(/<style/g, '<new-style')
      .replace(/<\/style>/g, '</new-style>')  // 替换style标签
    let nodeTree = fileParser(reContent)
    let styleText = ''

    nodeTree.childNodes.forEach(node => {
      let tagName = node.tagName || node.rawTagName

      if (tagName && tagName.toLowerCase() == 'new-style') {
        let isCssStyle = node.rawAttrs.indexOf('lang="css"') > -1 || node.rawAttrs.indexOf(`lang="`) == -1

        if (option.preProcessor) {
          if (isCssStyle || node.rawAttrs.indexOf(`lang="${option.preProcessor}`) > -1)
          styleText += node.childNodes[0].rawText
        } else {
          if (isCssStyle) {
            styleText += node.childNodes[0].rawText
          }
        }
      }
    })

    let styleStr = dataStore.styleVars + styleText

    if (styleStr) {
      await findFont(styleStr, key => {
        let nodes = nodeTree.querySelectorAll(key)

        if (nodes.length > 0) {
          nodes.forEach(n => {
            dataStore.collectTextStr += collectText(n)  // 收集使用新字体的文字
          })
        }
      })
    }
  })

}

async function findFont (styleStr, cb) {
  let option = options.option

  if (styleStr) {
    let output
    let cssJson

    if (!option.preProcessor) {
      cssJson = css2json(styleStr)
    } else {
      switch (option.preProcessor) {
        case 'less':
          output = await less.render(styleStr)
          cssJson = css2json(output.css)
          break
        case 'scss':
          output = sass.renderSync({
            data: styleStr
          })
          cssJson = css2json(output.css + '')
          break
        case 'styl':
          output = renderStyl(styleStr)
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

function minFont (doneCb) {
  let option = options.option
  let fontFilePath = option.fontFilePath
  let rText = dataStore.collectTextStr.replace(/\r/g, '')
    .replace(/\n/g, '').replace(/ /g, '')
  var sText  =  [].filter.call(rText,(s,i,o)=>o.indexOf(s)==i).join('')  // 文字去重
  if (option.showCollectText) {
    console.log(`扫描到:\n\t${sText}`)
  }

  console.log('压缩中...')
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
      text: sText,
      hinting: false
    }))

  fontMin.run((err, files) => {
    if (err) {
      console.error(err)
      return
    }
    console.log("\033[1A\033[K\033[1A")
    console.log("\033[40;34m字体压缩完成\033[0m")
    doneCb()
  })
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

module.exports = {
  options,
  parseStyleVar,
  parseVueFile,
  minFont
}
