const Fontmin = require('fontmin');
const path = require('path')
const rename = require('gulp-rename');
const fs = require('fs')
const options = require('./options')

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

module.exports = minFont
