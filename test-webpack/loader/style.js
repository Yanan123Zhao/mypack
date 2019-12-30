
const loaderUtils = require('loader-utils')

function loader (source) {
  const code = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return code
}

loader.pitch = function (remainingRequest) {// css-loader!less-loader!a.less
  console.log('rrr', remainingRequest)
  const code = `
    let style = document.createElement('style')
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
    document.head.appendChild(style)
  `
  return code
}

module.exports = loader