const fileParser = require('node-html-parser').parse
const bannerText = require('./libs/banner').bannerText1
const { options, travelFiles, findFont, minFont } = require('./libs/utils')

var collectTextStr = ''
var startTs

async function sss (option) {
  options.set(option)
  startTs = new Date().getTime()
  console.log(bannerText)
  if (!option.preProcessor) {
    console.log("Tip: 未使用css预处理器")
  }
  let resText = ''
  let styleVars = ''

  if (option.preProcessor && option.styleVarDir) {
    await travelFiles(option.basePath,`.${option.preProcessor}`, content => {
      styleVars = styleVars + '\r\n' + content + '\r\n'
    })
  }

  await travelFiles(option.basePath, '.vue', content => {
    return (async function () {
      let reContent = content.replace(/<style/g, '<new-style')
        .replace(/<\/style>/g, '</new-style>')  // 替换style标签
      let nodeTree = fileParser(reContent)
      let styleText = ''

      nodeTree.childNodes.forEach(node => {
        if (node.tagName == 'new-style') {  // 处理style
          if (!option.preProcessor) {
            styleText = node.childNodes[0].rawText
          } else if (option.preProcessor && node.rawAttrs.indexOf(option.preProcessor) > -1) {
            styleText = node.childNodes[0].rawText
          }
        }
      })

      if (styleText) {
        await findFont(styleText, styleVars, key => {
          let nodes = nodeTree.querySelectorAll(key)
          if (nodes.length > 0) {
            nodes.forEach(n => {
              collectTextStr += collectText(n)  // 收集使用新字体的文字
            })
            if (collectTextStr) {
              resText += collectTextStr
            }
          }
        })
      }
    })()
  })

  console.log("\033[40;34m扫描文件完成\033[0m")

  // 收集文字处理和去重
  let rText = resText.replace(/\r/g, '').replace(/\n/g, '').replace(/ /g, '')
  var sText  =  [].filter.call(rText,(s,i,o)=>o.indexOf(s)==i).join('')
  if (option.showCollectText) {
    console.log(`扫描到:\n\t${sText}`)
  }
  minFont(sText, () => {
    let endTs = new Date().getTime()
    let through = endTs - startTs
    console.log("\n\033[42;30m DONE \033[40;32m " + "压缩字体成功，用时" + through + "ms\033[0m")
  })  // 压缩字体文件
}

module.exports = sss
