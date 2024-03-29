'use-strict'

const _ = require('lodash')
const { readJSON } = require('./ioUtils')
const { addPropToTarget } = require('./constructTarget')
const { querySingleProp, queryAll } = require('./queryJson')
const { validateWithSchema, validationUtil } = require('../schema/validator')
const { pickTemplateVarsFromString, wrapInVarBraces } = require('./stringUtils')
const { formatPropValueIfNecessary } = require('./formattingUtils')
const fs = require('fs')
const async = require('async')
const { Transform } = require('stream')

const commands = {
  FIELDSET: 'fieldset',
  FROM: 'from',
  TO: 'to',
  FROMEACH: 'fromEach'
}

const mapArrayWithTemplate = async (
  sourceFile,
  xFormTemplateFile,
  continueOnError = false
) => {
  const { source, xFormTemplate } = readFromFiles(sourceFile, xFormTemplateFile)
  return await mapToNewObjects(source, xFormTemplate, continueOnError)
}

const mapWithTemplateAsync = async (sourceFile, xFormTemplateFile) => {
  return new Promise((resolve, reject) => {
    try {
      const result = mapWithTemplate(sourceFile, xFormTemplateFile)
      resolve(result)
    } catch (error) {
      reject(new Error(`An error occured during transformation ${error}`))
    }
  })
}

const mapToNewObjects = async (
  sourceData,
  xFormTemplate,
  continueOnError = false
) => {
  return Promise.all(
    sourceData.map((source) =>
      mapToNewObjectAsync(source, xFormTemplate, continueOnError)
    )
  )
}

const mapToNewObjectAsync = async (
  source,
  xFormTemplate,
  continueOnError = false
) => {
  return new Promise((resolve, reject) => {
    try {
      const result = mapToNewObject(source, xFormTemplate)
      resolve(result)
    } catch (error) {
      if (continueOnError) {
        resolve({ error: error.message })
      } else {
        reject(new Error(`An error occured during transformation ${error}`))
      }
    }
  })
}

const xFormStream = (template) => {
  return new Transform({
    objectMode: true,
    transform (chunk, _, callback) {
      const result = mapToNewObject(JSON.parse(chunk.toString()), template)
      callback(null, JSON.stringify(result, null, 4))
    }
  })
}

const streamBatchProcess = (inputDir, outputDir, xFormTemplate) => {
  const filesToTransform = fs.readdirSync(inputDir)
  async.forEachOf(filesToTransform, (value, _1, _2) => {
    const newFilename = `${_.trimEnd(value, '.json')}.transformed.json`
    fs.createReadStream(`${inputDir}/${value}`)
      .pipe(xFormStream(xFormTemplate))
      .pipe(fs.createWriteStream(`${outputDir}/${newFilename}`))
  })
}

const readFromFiles = (sourceFile, xFormTemplateFile) => {
  return {
    source: readJSON(sourceFile),
    xFormTemplate: readJSON(xFormTemplateFile)
  }
}

const mapWithTemplate = (sourceFile, xFormTemplateFile) => {
  const { source, xFormTemplate } = readFromFiles(sourceFile, xFormTemplateFile)

  return mapToNewObject(source, xFormTemplate)
}

const mapToNewObject = (source, xFormTemplate) => {
  const _source = Object.create(null)
  const _xFormTemplate = Object.create(null)
  Object.assign(_source, source)
  Object.assign(_xFormTemplate, xFormTemplate)
  const result = validateWithSchema(_xFormTemplate)
  if (!result.valid) {
    throw Error(validationUtil.getErrorMessage(result))
  }
  return traverseTemplate(_source, _xFormTemplate)
}

const flattenEverything = (everything) => {
  let copyEverything = Object.assign({}, everything)
  for (const [key, val] of Object.entries(everything)) {
    if (val.constructor === Array && val.length === 1) {
      const explodedArray = Object.assign({}, ...val)
      copyEverything = { ...copyEverything, ...explodedArray }
      delete copyEverything[key]
    } else if (val.constructor === Array && val.length > 1) {
      const allKeys = Object.keys(...val)
      if (allKeys.length === 1) {
        const onlyKey = allKeys[0]
        const pureValues = []
        Object.values(val).forEach((value) => {
          if (value[onlyKey]) {
            pureValues.push(value[onlyKey])
          }
        })
        copyEverything[onlyKey] = pureValues
      } else {
        copyEverything = val.slice()
      }
      delete copyEverything[key]
    }
  }
  return copyEverything
}

const addBlockToTarget = (block, target, flatten) => {
  const newTarget = [...target]
  if (flatten) {
    const flattened = flattenEverything(block)
    if (flattened.constructor === Array) {
      newTarget.push(...flattened)
    } else {
      newTarget.push(flattened)
    }
  } else {
    block.constructor === Array
      ? newTarget.push(...block)
      : newTarget.push(block)
  }
  return newTarget
}

const traverseFromEach = (source, fromEachTemplate, target) => {
  const field = fromEachTemplate.field
  const to = fromEachTemplate.to || field
  const flatten = fromEachTemplate.flatten || false
  const fieldSources = queryAll(source, field)
  if (!Object.keys(target).find((k) => k === to)) {
    target[to] = []
  }
  if (fromEachTemplate.fieldset) {
    target[to] = addBlockToTarget(
      traverseFieldsets(fieldSources, fromEachTemplate.fieldset, flatten),
      target[to],
      flatten
    )
  } else if (fromEachTemplate.fromEach) {
    target[to] = addBlockToTarget(
      traverseFromEach(fieldSources, fromEachTemplate.fromEach, {}),
      target[to],
      flatten
    )
  } else {
    target[to] = addBlockToTarget(fieldSources, target[to], flatten)
  }

  return target
}

const traverseFieldsets = (sources, parentTemplate, flatten) => {
  let fieldsetTarget = flatten ? {} : []
  if (sources.constructor !== Array) {
    sources = [sources]
  }
  sources.forEach((item) => {
    if (!flatten) {
      const fieldsetResult = traverseFieldset(item, parentTemplate, {})
      if (!_.isEmpty(fieldsetResult)) {
        fieldsetTarget.push(fieldsetResult)
      }
    } else {
      fieldsetTarget = traverseFieldset(item, parentTemplate, fieldsetTarget)
    }
  })
  return fieldsetTarget
}

const traverseFieldset = (source, fieldsetTemplate, target) => {
  fieldsetTemplate.forEach((item) => {
    if (item.fromEach) {
      target = {
        ...target,
        ...traverseFromEach(source, item[commands.FROMEACH], target)
      }
    }

    if (item.from) {
      const from = item.from
      let to = item.to || item.from

      let fromValue = querySingleProp(source, from)
      if (item.valueToKey) {
        to = fromValue
        fromValue = querySingleProp(source, item.withValueFrom)
      }
      if (!fromValue) {
        return
      }

      const currentTarget = addPropToTarget(
        target,
        to,
        fromValue,
        item.toArray,
        item.via
      )
      target = { ...target, ...currentTarget }
    }

    if (item.withTemplate) {
      const to = item.to || item.withValueFrom
      const templateVars = pickTemplateVarsFromString(item.withTemplate)
      if (templateVars && templateVars.length > 0) {
        const pairs = {}
        templateVars.forEach((item) => {
          pairs[item] = querySingleProp(source, item)
        })
        let resolvedTemplate = item.withTemplate
        for (const [name, value] of Object.entries(pairs)) {
          resolvedTemplate = resolvedTemplate.replace(
            wrapInVarBraces(name),
            formatPropValueIfNecessary(value, item.via)
          )
        }
        const currentTarget = addPropToTarget(target, to, resolvedTemplate)
        target = { ...target, ...currentTarget }
      } else {
        const currentTarget = addPropToTarget(target, to, item.withTemplate)
        target = { ...target, ...currentTarget }
      }
    }
  })
  return target
}

const traverseTemplate = (source, xFormTemplate) => {
  return traverseFieldset(source, xFormTemplate[commands.FIELDSET], {})
}

module.exports = {
  mapToNewObject,
  mapWithTemplate,
  mapWithTemplateAsync,
  mapToNewObjectAsync,
  mapToNewObjects,
  mapArrayWithTemplate,
  streamBatchProcess,
  xFormStream
}
