const { readJSON } = require('./ioUtils');
const { addPropToTarget } = require('./constructTarget');
const { querySingleProp, queryAll } = require('./queryJson');
const { validateWithSchema, validationUtil } = require('../schema/validator');

const commands = {
  FIELDSET: 'fieldset',
  FROM: 'from',
  TO: 'to',
  FROMEACH: 'fromEach'
};

const mapWithTemplate = (sourceFile, xformTemplateFile) => {
  const source = readJSON(sourceFile);
  const xformTemplate = readJSON(xformTemplateFile);

  return mapToNewObject(source, xformTemplate);
};

const mapToNewObject = (source, xFormTemplate) => {
  const result = validateWithSchema(xFormTemplate);
  if (!result.valid) {
    throw Error(validationUtil.getErrorMessage(result));
  }
  return traverseTemplate(source, xFormTemplate);
};

const flattenEverything = (everything) => {
  let copyEverything = Object.assign({}, everything);
  for (const [key, val] of Object.entries(everything)) {
    if (val.constructor === Array) {
      let explodedArray = Object.assign({}, ...val);
      delete copyEverything[key];
      copyEverything = {...copyEverything, ...explodedArray};
    }
  }
  return copyEverything;
};

const addBlockToTarget = (block, target, flatten) => {
  let newTarget = [...target];
  if (flatten) {
    newTarget.push(flattenEverything(block));
  } else {
    newTarget.push(block);
  }
  return newTarget;
};

const traverseFromEach = (source, fromEachTemplate, target) => {
  const field = fromEachTemplate.field;
  const to = fromEachTemplate.to || field;
  const flatten = fromEachTemplate.flatten || false;
  const fieldSources = queryAll(source, field);
  target[to] = new Array();
  if (fromEachTemplate.fieldset) {
    target[to] = addBlockToTarget(
      traverseFieldsets(fieldSources, fromEachTemplate.fieldset),
      target[to],
      flatten
    );
  } else if (fromEachTemplate.fromEach) {
    target[to] = addBlockToTarget(
      traverseFromEach(fieldSources, fromEachTemplate.fromEach, {}),
      target[to],
      flatten
    );
  } else {
    target[to] = addBlockToTarget(fieldSources, target[to], flatten);
  }

  return target;
};

const traverseFieldsets = (sources, parentTemplate) => {
  let fieldsetTarget = {};
  sources.forEach((item) => {
    fieldsetTarget = traverseFieldset(item, parentTemplate, fieldsetTarget);
  });
  return fieldsetTarget;
};

const traverseFieldset = (source, fieldsetTemplate, target) => {
  fieldsetTemplate.forEach((item) => {
    if (item.fromEach) {
      target = {
        ...target,
        ...traverseFromEach(source, item[commands.FROMEACH], target)
      };
    }

    if (item.from) {
      const from = item.from;
      const to = item.to || item.from;

      const fromValue = querySingleProp(source, from);
      let currentTarget = addPropToTarget(target, to, fromValue);
      target = { ...target, ...currentTarget };
    }
  });
  return target;
};

const traverseTemplate = (source, xFormTemplate) => {
  return traverseFieldset(source, xFormTemplate[commands.FIELDSET], {});
};

module.exports = { mapToNewObject, mapWithTemplate, traverseTemplate };
