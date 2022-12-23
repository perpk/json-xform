'use-strict'

const jsonpath = require('jsonpath')

/**
 * This is necessary since {@link jsonpath} seems to only recognize objects that carry __proto__
 * @param {@type Object} from The prototype-free object
 * @returns {@type Object} A cloned version of the {@param from} parameter with __proto__
 */
const makeObject = (from) => {
  return Object.assign({}, from)
}

const querySingleProp = (json, prop) => {
  return jsonpath.query(makeObject(json), constructQueryForProp(prop))[0]
}

const queryAll = (json, prop) => {
  return jsonpath.query(makeObject(json), '$..' + prop)[0]
}

const queryArrayElements = (json, array, prop) => {
  return jsonpath.query(makeObject(json), '$.' + array + '..' + prop)
}

const evaluateProp = (prop) => {
  if (!prop.match(/[^a-zA-Z0-9.]+/)) {
    return `.${prop}`
  }
  return `['${prop}']`
}

const constructQueryForProp = (prop) => {
  if (prop.indexOf('.') >= 0) {
    const parts = prop.split('.')
    const assembledQuery = assembleQueryRecursively(parts)
    return `$${assembledQuery.join('')}`
  }

  return `$${evaluateProp(prop)}`
}

const assembleQueryRecursively = (parts, currentQuery = null) => {
  if (!currentQuery) {
    currentQuery = []
  }
  const current = parts.shift()
  if (!current) {
    return null
  }
  currentQuery.push(evaluateProp(current))
  const nextOne = assembleQueryRecursively(parts, currentQuery)
  if (nextOne) {
    currentQuery.push(nextOne)
  }
  return currentQuery
}

module.exports = {
  querySingleProp,
  queryAll,
  queryArrayElements,
  constructQueryForProp
}
