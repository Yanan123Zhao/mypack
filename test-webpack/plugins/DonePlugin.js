class DonePlugins {
  apply (compilar) {
    compilar.hooks.done.tap('DonePlugins', function () {
      console.log('编译完成~~')
    })
  }
}

module.exports = DonePlugins