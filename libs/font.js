const Fontmin = require('fontmin');
const path = require('path')
const rename = require('gulp-rename');
const fs = require('fs')

function minFont (text, fontFilePath) {
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
      hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
    }));

  fontMin.run((err, files) => {
    if (err) {
      console.error(err)
      return
    }
    console.log("\033[1A\033[K\033[1A")
    console.log("\033[40;34mcompress font finished\033[0m")
    console.log("\n\033[42;30m DONE \033[40;32m " + "Compress font success\033[0m")
  });
}

module.exports = minFont
