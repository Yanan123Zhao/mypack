#! /usr/bin/env node
const path = require('path')
const Compilar = require('../lib/Compilar.js')

const configFile = require(process.cwd() + '/webpack.config.js')

const compilar = new Compilar(configFile)

compilar.run()