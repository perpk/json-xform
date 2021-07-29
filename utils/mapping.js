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
    if (val.constructor === Array && val.length === 1) {
      let explodedArray = Object.assign({}, ...val);
      copyEverything = {...copyEverything, ...explodedArray};
      delete copyEverything[key];
    } else if (val.constructor === Array && val.length > 1) {
      copyEverything = val.slice();
      delete copyEverything[key];
    }
  }
  return copyEverything;
};

const addBlockToTarget = (block, target, flatten) => {
  let newTarget = [...target];
  if (flatten) {
    let flattened = flattenEverything(block);
    if (flattened.constructor === Array) {
      newTarget.push(...flattened);
    } else {
      newTarget.push(flattened);
    }
  } else {
    block.constructor === Array ? newTarget.push(...block) : newTarget.push(block);
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
      traverseFieldsets(fieldSources, fromEachTemplate.fieldset, flatten),
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

const traverseFieldsets = (sources, parentTemplate, flatten) => {
  let fieldsetTarget = flatten ? {} : new Array();
  sources.forEach((item) => {
    if (!flatten) {
      fieldsetTarget.push(traverseFieldset(item, parentTemplate, {}));
    } else {
      fieldsetTarget = traverseFieldset(item, parentTemplate, fieldsetTarget);
    }
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
      if(!fromValue) {
        return;
      }
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
