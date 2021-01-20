##font-snake   2.0
扫描vue项目压缩字体文件
- 安装font-snake  
```shell script
npm i font-snake --save-dev
```
- 项目增加命令脚本 scripts/minFont.js
```js
const sss = require('font-snake')

let options = {
  fontName: 'new-font',  // 新字体的名字（font-family）
  fontFilePath: './src/assets/fonts/font2.ttf', // 字体文件路径（相对于项目根目录）
  basePath: './src/components',  // 扫描的目录
  preProcessor: 'styl',  // css预处理器文件后缀，支持css, less, scss, sass, styl (不带".", 留空为css)
  styleVarDir: './src/assets/style',  // css预处理器变量文件目录
  showCollectText: true   // 是否显示收集的去重文本
}
sss(options)
```
- 修改package.json
```json
{
  "scripts": {
    "min-font": "node ./scripts/minFont.js"
  }
}
```


