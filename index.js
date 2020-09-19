const travelFiles = require('./libs/look')
const fileParser = require('node-html-parser').parse
const minFont = require('./libs/font')
const findFont = require('./libs/find')
const bannerText = require('./libs/banner').bannerText1

var collectTextStr = ''

function collectText (node, cb) {
  function loop (root) {
    if (root.rawText) {
      collectTextStr += root.rawText
      return
    } else if (root.childNodes) {
      root.childNodes.forEach(c => loop(c))
    }
  }
  loop(node)
}

// let options = {
//   fontName: 'new-font',
//   fontFilePath: 'fonts/font2.ttf',
//   basePath: './src',
//   lessVarDir: './src/assets',
//   showCollectText: true
// }

async function sss (options) {
  console.log("\033[2J")
  console.log(bannerText)
  let resText = ''
  let lessVars = ''
  if (options.lessVarDir) {
    await travelFiles(options.lessVarDir, '.less', content => {
      lessVars = lessVars + '\r\n' + content + '\r\n'
    })
  }

  await travelFiles(options.basePath, '.vue', content => {
    async function f() {
      let reContent = content.replace(/<style/g, '<new-style')
        .replace(/<\/style>/g, '</new-style>')  // 替换style标签
      let nodeTree = fileParser(reContent)
      let styleText = ''
      nodeTree.childNodes.forEach(node => {
        if (node.tagName == 'new-style') {  // 处理style
          styleText = node.childNodes[0].rawText
        }
      })
      if (styleText) {
        await findFont(styleText, lessVars, options.fontName, key => {
          let nodes = nodeTree.querySelectorAll(key)
          if (nodes.length > 0) {
            nodes.forEach(n => {
              collectText(n)  // 收集使用新字体的文字
            })
            if (collectTextStr) {
              resText += collectTextStr
              // console.log(collectTextStr)
            }
          }
        })
      }
    }
    return f()
  })

  console.log("\033[40;34mparse file finished\033[0m")

  // 收集文字处理和去重
  let rText = resText.replace(/\r/g, '').replace(/\n/g, '').replace(/ /g, '')
  var sText  =  [].filter.call(rText,(s,i,o)=>o.indexOf(s)==i).join('')
  if (options.showCollectText) {
    console.log(`find text:\n\t${sText}`)
  }
  minFont(sText, options.fontFilePath)  // 压缩字体文件

}

// sss(options)

module.exports = sss
