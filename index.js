const bannerText = require('./libs/banner').bannerText1
const { options, parseStyleVar, parseVueFile, minFont } = require('./libs/utils')

var startTs

async function sss (option) {
  options.set(option)
  startTs = new Date().getTime()
  console.log(bannerText)

  if (!option.preProcessor) {
    console.log("Tip: 未使用css预处理器")
  }
  await parseStyleVar()
  await parseVueFile()
  console.log("\033[40;34m扫描文件完成\033[0m")

  minFont(() => {
    let endTs = new Date().getTime()
    let through = endTs - startTs
    console.log("\n\033[42;30m DONE \033[40;32m " + "压缩字体成功，用时" + through + "ms\033[0m")
  })
}

module.exports = sss
