'use-strict'

const dFormat = require('date-fns/format')
const parse = require('date-fns/parse')

const { executeCommandFromString } = require('./commandUtils')

const createFormatter = (type) => {
  switch (type) {
    case 'date':
      return dateFormatter
    case 'custom':
      return customFormatter
    default:
      throw Error(`There's no type named ${type} known currently`)
  }
}

const dateFormatter = (value, format, sourceFormat) => {
  try {
    const date = parse(value, sourceFormat, new Date())
    return dFormat(date, format)
  } catch (ex) {
    throw Error(`${ex.message} error occured when trying to format ${value} with ${format}`)
  }
}

const customFormatter = (value, format, _) => {
  try {
    return executeCommandFromString(value, format)
  } catch (ex) {
    throw Error(`${ex.message} error occured when trying to format ${value} with ${format}`)
  }
}

const formatPropValueIfNecessary = (propValue, via) => {
  if (!via) {
    return propValue
  }

  const formatter = createFormatter(via.type)
  return formatter(propValue, via.format, via.sourceFormat)
}

module.exports = { formatPropValueIfNecessary, createFormatter, dateFormatter }
