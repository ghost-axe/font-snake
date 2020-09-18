// console.log(process.argv)
const travelFiles = require('./look')
const fileParser = require('node-html-parser').parse
var css2json = require('css2json');
const less = require('less')
const minFont = require('./font')

function findFont (lessStyleStr, lessVars, fontName, cb) {
  console.log('finding font: ' + fontName)
  let rStr = lessVars + lessStyleStr
  less.render(rStr)
    .then(
      function (output) {
        let cssJson = css2json(output.css)
        // console.log(cssJson)
        for (let key in cssJson) {
          let item = cssJson[key]
          if (item['font-family'] && item['font-family'] == fontName) {
            cb(key)
          }
        }
      },
      function (error) {
        console.log(error)
      }
    );
}
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

function sss (options) {
  let lessVars = ''
  if (options.lessVarDir) {
    travelFiles(options.lessVarDir, '.less', content => {
      lessVars = lessVars + '\r\n' + content
    })
  }
  travelFiles(options.basePath, '.vue', content => {
    let reContent = content.replace(/<style/g, '<new-style')
      .replace(/<\/style>/g, '</new-style>')
    let nodeTree = fileParser(reContent)
    nodeTree.childNodes.forEach(node => {
      if (node.tagName == 'new-style') {
        findFont(node.childNodes[0].rawText, lessVars, options.fontName, key => {
          let nodes = nodeTree.querySelectorAll(key)
          if (nodes.length > 0) {
            nodes.forEach(n => {
              collectText(n)
            })
            if (collectTextStr) {
              let rText = collectTextStr.replace(/\r/g, '').replace(/\n/g, '').replace(/ /g, '')
              var sText  =  [].filter.call(rText,(s,i,o)=>o.indexOf(s)==i).join('')
              if (options.showCollectText) {
                console.log(`find text:\n\t${sText}`)
              }
              minFont(sText, options.fontFilePath)
            }
          }
        })
      }
    })
  })
}

// sss(options)

module.exports = sss
