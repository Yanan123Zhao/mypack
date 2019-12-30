class BundleFileList {
  constructor (props) {
    this.filename = props.filename
  }
  apply (compilar) {
    compilar.hooks.emit.tap('BundleFileList', (compilation) => {
      const {assets} = compilation
      const keys = Object.keys(assets)
      let code = `## filename    size\r\n`
      for (let key of keys) {
        code += `- ${key}    ${assets[key].size()}\r\n`
      }
      assets[this.filename] = {
        source () {
          return code
        },
        size () {
          return code.length
        }
      }
    })
  }
}

module.exports = BundleFileList