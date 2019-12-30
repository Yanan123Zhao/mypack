const core = require('@babel/core')
const utils = require('loader-utils')
function babelLoader (source) {
  console.log('source', source)
  console.log('this', utils.getOptions(this))
  const options = utils.getOptions(this)
  const cb = this.async()
  core.transform(source, {
    presets: options.presets,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  }, (err, result) => {
    cb(err, result.code, result.map)
  })
  // return source
}
  

module.exports = babelLoader