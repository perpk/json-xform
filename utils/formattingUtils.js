'use-strict'

const dFormat = require('date-fns/format')
const parse = require('date-fns/parse')
const { executeTransformationCommands } = require('./transformUtils')

const createFormatter = (type) => {
  switch (type) {
    case 'date':
      return dateFormatter
    case 'commands':
      return commandsFormatter
    default:
      throw Error(`There's no type named ${type} known currently`)
  }
}

const dateFormatter = (value, { format, sourceFormat }) => {
  try {
    const date = parse(value, sourceFormat, new Date())
    return dFormat(date, format)
  } catch (ex) {
    throw Error(
      `${ex.message} error occured when trying to format ${value} with ${format}`
    )
  }
}

const commandsFormatter = (value, { transform }) => {
  try {
    return executeTransformationCommands(value, transform)
  } catch (ex) {
    throw Error(
      `${
        ex.message
      } error occured when trying to format ${value} with one of ${JSON.stringify(
        transform,
        null,
        2
      )}`
    )
  }
}

const formatPropValueIfNecessary = (propValue, via) => {
  if (!via) {
    return propValue
  }

  const formatter = createFormatter(via.type)
  return formatter(propValue, via)
}

module.exports = { formatPropValueIfNecessary, createFormatter, dateFormatter }
