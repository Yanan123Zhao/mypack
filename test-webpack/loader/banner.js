// 给打包出来的代码前面加注释文本
const loaderUtils = require('loader-utils')
const ValidateUtils = require('schema-utils')
const fs = require('fs')
function loader (source) {
  const options = loaderUtils.getOptions(this)
  const cb = this.async()
  const schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  ValidateUtils(schema, options, 'banner-loader')

  if (options.filename) {
    this.addDependency(options.filename)
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/* ${data} */${source}`)
    })
  } else {
    cb(null, `/* ${options.text} */${source}`)
  }

}
module.exports = loader