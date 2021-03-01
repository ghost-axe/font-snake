const sss = require('./index')

let testOptions = {
  fontName: 'new-font',
  fontFilePath: 'fonts/font2.ttf',
  basePath: './src',
  preProcessor: 'less',
  styleVarDir: './src/assets',
  showCollectText: true
}

sss(testOptions)
