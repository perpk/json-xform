'use-strict'

const { formatPropValueIfNecessary } = require('./formattingUtils')

const addPropToTarget = (
  target,
  property,
  propertyValue,
  toArray = false,
  via = null
) => {
  const newTarget = { ...target }
  if (property.indexOf('.') >= 0) {
    const parts = property.split('.')
    addPropRecursive(parts, newTarget, propertyValue, toArray, via)
  } else if (!newTarget[property]) {
    const formattedValue = formatPropValueIfNecessary(propertyValue, via)
    newTarget[property] = toArray ? [formattedValue] : formattedValue
  }
  return newTarget
}

const addPropRecursive = (
  elems,
  target,
  value,
  toArray = false,
  via = null
) => {
  const current = elems.shift()
  if (!current) {
    const formattedValue = formatPropValueIfNecessary(value, via)
    target = toArray ? [formattedValue] : formattedValue
    return target
  }
  Object.freeze(target.prototype)
  Object.freeze(current.prototype)
  if (!target[current]) {
    target[current] = {}
  }
  target[current] = addPropRecursive(
    elems,
    target[current],
    value,
    toArray,
    via
  )
  return target
}

module.exports = { addPropToTarget }
