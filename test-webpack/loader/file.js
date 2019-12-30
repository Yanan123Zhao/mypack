// 将图片转换成二进制，根据图片生成MD5,发射到dist目录 ，最后返回图片路径
const loaderUtils = require('loader-utils')
function loader (source) {
  const fileName = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content: source
  })
  this.emitFile(fileName, source)
  return `module.exports="${fileName}"`
}

loader.raw = true

module.exports = loader