function loader (source) {
  const arr = ['var list = []']
  const reg = /url\((.*)\)/g
  let pos = 0
  let regResult
  // console.log('ddd111', reg.exec(source))
  // console.log('ddd222', reg.exec(source))
  // const 
  // const [] = 
  while (regResult = reg.exec(source)) {// 每次匹配都会向前移
    const [withUrl, jContent] = regResult // url('./p.png') => url(require('./p.png'))
    // console.log('rrr', typeof source, source, reg.lastIndex)
    const preIndex = reg.lastIndex - withUrl.length
    const content = source.slice(pos, preIndex)
    arr.push(`list.push(${JSON.stringify(content)})`)
    arr.push(`list.push("url(" + require(${jContent}) + ")")`)
    pos = reg.lastIndex
  }
  arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
  arr.push(`module.exports = list.join('')`)
  
  let code = arr.join('\r\n')
  return code
}

module.exports = loader