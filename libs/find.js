const css2json = require('css2json')
const less = require('less')
const sass = require('node-sass')
const renderStyl = require('./renderStyl')
const options = require('./options')

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

module.exports = findFont
