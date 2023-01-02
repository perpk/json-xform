'use-strict'

const _ = require('lodash')

const executeTransformationCommands = (value, transform) => {
  validateTransformationRules(transform)

  return invokeRulesRecursively(value, transform)
}

const getParams = (transform) => {
  return _.isEmpty(transform.params) ? [] : transform.params
}

const invokeRulesRecursively = (value, transform) => {
  const curTrans = transform.shift()
  const nextVal = invoke(value, curTrans)
  if (!_.isEmpty(transform)) {
    return invokeRulesRecursively(nextVal, transform)
  }
  return nextVal
}

const invoke = (value, transform) => {
  if (transform.map === true) {
    return _.invokeMap(value, transform.command, ...getParams(transform))
  }
  return _.invoke([value], `[0].${transform.command}`, ...getParams(transform))
}

const validateTransformationRules = (transform) => {
  for (const rule of transform) {
    checkIfValid(rule.command)

    transform
      .flatMap((c) => c.params)
      .filter((f) => f)
      .map((p) => checkIfValid(p))
  }
}

const checkIfValid = (transformProp) => {
  if (
    transformProp.toString().trim().toLowerCase().includes('__proto__') ||
    transformProp.toString().trim().toLowerCase().includes('prototype')
  ) {
    throw Error('Usage __proto__, prototype is not supported')
  }

  if (typeof transformProp === 'function') {
    throw Error('Functions are not supported in transformation rules')
  }
}

module.exports = { executeTransformationCommands }
