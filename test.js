const sss = require('./index')

let testOptions = {
  fontName: 'new-font',
  fontFilePath: 'fonts/font2.ttf',
  basePath: './src',
  preProcessor: 'styl',
  styleVarDir: './src/assets',
  showCollectText: true
}

sss(testOptions)
