'use-strict'

const _ = require('lodash')

const executeCommandFromString = (value, format) => {
  if (!isCommandLegal(`"${value}"${format}`)) {
    return null
  }

  const cmd = tearCommandStringApart(format)

  return _.invoke([value], `[0].${cmd[0]}`)
}

const isCommandLegal = (cmdStr) => {
  if (cmdStr.trim().includes('__proto__') || cmdStr.trim().includes('prototype')) {
    return false
  }
  return true
}

const tearCommandStringApart = (cmdStr) => {
  return cmdStr.split('.')
}

module.exports = { executeCommandFromString }
