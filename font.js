var Fontmin = require('fontmin');
var rename = require('gulp-rename');
var fs = require('fs')

if (!fs.existsSync('fonts/backup-font2.ttf')) {
  fs.writeFileSync('fonts/backup-font2.ttf', fs.readFileSync('fonts/font2.ttf'));
}

var fontMin = new Fontmin()
  .src('fonts/backup-font2.ttf')
  .dest('fonts')
  .use(rename('font3.ttf'))
  .use(Fontmin.glyph({
    text: '天地玄黄 宇宙洪荒',
    hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
  }));

fontMin.run();

