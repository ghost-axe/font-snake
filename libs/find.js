const css2json = require('css2json')
const less = require('less')

async function findFont (lessStyleStr, lessVars, fontName, cb) {
  let rStr = lessVars + lessStyleStr  // 拼接less变量和style
  if (rStr) {
    let output = await less.render(rStr)
    let cssJson = css2json(output.css)
    // console.log(cssJson)
    for (let key in cssJson) {
      let item = cssJson[key]
      if (item['font-family'] && item['font-family'] == fontName) {
        cb(key)
      }
    }
  }
}

module.exports = findFont
