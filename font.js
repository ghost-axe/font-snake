var Fontmin = require('fontmin');
var path = require('path')
var rename = require('gulp-rename');
var fs = require('fs')

function minFont (text, fontFilePath) {
  console.log('minfont ing......')
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
    console.log('Done')
  });
}

module.exports = minFont
