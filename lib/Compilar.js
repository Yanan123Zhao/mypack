const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default

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
          node.callee.name = '__webpack__require'
          let requireName = node.arguments[0].value
          requireName = requireName + (path.extname(requireName) ? '' : '.js')
          // requireName = requireName + (requireName.slice(-3) === '.js' ? '' : '.js')
          requireName = path.join(parentPath, requireName)
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
    const filePath = './' + path.relative(this.root, modulePath)
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

  }

  run () {
    this.buildModules(path.resolve(this.root, this.entryPath), true)
    console.log('this', this.modules, this.entryId)
    this.emitFile()
  }
}

module.exports = Compilar