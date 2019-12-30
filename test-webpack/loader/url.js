const loaderUtils = require('loader-utils')
const mime = require('mime')
function loader(source) {
  const {limit} = loaderUtils.getOptions(this)
  if (limit && source.length < limit) {
    return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('./file.js').call(this, source)
  }
}

loader.raw = true

module.exports = loader