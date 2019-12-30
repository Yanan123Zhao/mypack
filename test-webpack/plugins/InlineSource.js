const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin')

class InlineSourePlugin {
  constructor ({match}) {
    this.reg = match
  }
  processTag (tag, compilation) {
    let newTag, url
    /*{
      headTags: [ { tagName: 'link', voidTag: true, attributes: [Object] } ],
      bodyTags:
      [ { tagName: 'script', voidTag: false, attributes: [Object] } ]
   */
    // console.log('ss', compilation.assets)
    if (tag.tagName === 'link' && this.reg.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      url = tag.attributes.href
      // inner = compilation.assets[tag.attributes.href].source
    }
    if (tag.tagName === 'script' && this.reg.test(tag.attributes.src)) {
      // inner = compilation.assets[tag.attributes.src].source
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }
    if (url) {
      newTag.innerHTML = compilation.assets[url].source()
    }
    // console.log('newTag', newTag)
    return newTag
  }
  processTags (data, compilation) {
    // console.log('&&&&&', data)
    let {headTags, bodyTags} = data
    // const newTag
    headTags = headTags.map(headTag => {
      if (headTag.tagName === 'link') {
        return this.processTag(headTag, compilation)
      }
    });
    bodyTags = bodyTags.map(bodyTag => {
      if (bodyTag.tagName === 'script') {
        return this.processTag(bodyTag, compilation)
      }
    })
    return {
      ...data,
      headTags,
      bodyTags
    }
  }
  apply (compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugins', (data, cb) => {
        data = this.processTags(data, compilation)
        console.log('data', data)
        cb(null, data)
      })
    })
  }
}

module.exports = InlineSourePlugin