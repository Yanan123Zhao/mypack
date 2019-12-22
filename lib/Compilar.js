const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
const ejs = require('ejs')

class Compilar {
  constructor (config) {
    this.config = config
    this.entryId
    this.modules = {}
    this.entryPath = config.entry
    this.root = process.cwd()
  }

  getModuleSource (modulePath) {
    return fs.readFileSync(modulePath, 'utf8')
  }

  // 传入文件内容和，父级所在文件夹名称
  parse (content, parentPath) {
    const ast = babylon.parse(content)
    const depedences = []
    traverse(ast, {
      CallExpression (p) {
        const {node} = p
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let requireName = node.arguments[0].value
          requireName = requireName + (path.extname(requireName) ? '' : '.js')
          // 将window下的\转换为/
          requireName = './' + path.join(parentPath, requireName).replace(/\\/g, '/')
          node.arguments[0].value = requireName
          depedences.push(requireName)
        }
      }
    })

    const sourceCode = generator(ast).code
    return {
      sourceCode,
      depedences
    }
  }

  buildModules (modulePath, isEntry) {// isEntry表示是否是入口文件
    const fileContent = this.getModuleSource(modulePath)
    // 将window下的\转换为/
    const filePath = './' + path.relative(this.root, modulePath).replace(/\\/g, '/')
    if (isEntry) {
      this.entryId = filePath
    }
    const {sourceCode, depedences} = this.parse(fileContent, path.dirname(filePath))
    this.modules[filePath] = sourceCode
    depedences.forEach(dep => {
      this.buildModules(path.join(this.root, dep), false)
    })
  }

  emitFile () {
    const outputPath = this.config.output.path
    const filename =  this.config.output.filename
    const output = path.join(outputPath, filename)
    const temp = fs.readFileSync(path.resolve(__dirname, './template.ejs'), 'utf8')
    const code = ejs.render(temp, {
      entryPath: this.entryPath,
      modules: this.modules
    })
    fs.writeFileSync(output, code)
  }

  run () {
    this.buildModules(path.resolve(this.root, this.entryPath), true)
    console.log('this', this.modules, this.entryId)
    this.emitFile()
  }
}

module.exports = Compilar