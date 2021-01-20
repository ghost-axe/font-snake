const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

let stylePath1 = path.resolve('./temp.styl')
let stylePath2 = path.resolve('./temp.css')
let cmd = `stylus ${stylePath1} -o ${stylePath2}`

function renderStyl (styleStr) {
  if (!styleStr) {
    return ''
  }
  fs.writeFileSync(stylePath1, styleStr)
  execSync(cmd)
  let data = fs.readFileSync(stylePath2,'utf-8')
  fs.unlinkSync(stylePath1)
  fs.unlinkSync(stylePath2)
  return data
}

module.exports = renderStyl
