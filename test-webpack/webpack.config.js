const path = require('path')
const HtmlWebapck = require('html-webpack-plugin')
const DonePlugin = require('./plugins/DonePlugin.js')
const BundleFileList = require('./plugins/BundleFileList.js')
const InlineSource = require('./plugins/InlineSource')
const MiniCssExtract = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // resolveLoader: {
  //   alias: path.resolve(__dirname, './loader')
  // }
  devtool:'source-map',
  // watch: true,
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: path.resolve(__dirname, './loader/banner.js'),
      //     options: {
      //       text: 'yanan created',
      //       filename: path.resolve(__dirname, 'sideEffect', 'banner-loader.js')
      //     }
      //   }
      // }, {
      //   test: /\.png$/,
      //   use: {
      //     loader: path.resolve(__dirname, './loader/url.js'),
      //     options: {
      //       limit: 200 * 1024
      //     }
      //   }
      // }, {
      //   test: /\.less$/,
      //   use: [
      //     path.resolve(__dirname, 'loader', 'style.js'),
      //     path.resolve(__dirname, 'loader', 'css.js'),
      //     path.resolve(__dirname, 'loader', 'less.js')
      //   ]
      // }
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: path.resolve(__dirname, './loader/babel.js'),
      //     options: {
      //       presets: [
      //         '@babel/preset-env'
      //       ]
      //     }
      //   }
      // }
      {
        test: /\.css$/,
        use: [
          MiniCssExtract.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtract({
      filename: 'main.css'
    }),
    new HtmlWebapck({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new BundleFileList({
      filename: 'list.md'
    }),
    new InlineSource({
      match: /.(js|css)$/
    })
  ]
}