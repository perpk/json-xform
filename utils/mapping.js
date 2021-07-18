const _ = require('lodash');
const { readJSON } = require('./ioUtils');
const { addPropToTarget } = require('./constructTarget');
const {
  querySingleProp,
  queryAll,
  queryArrayElements
} = require('./queryJson');

const commands = {
  FIELDSET: 'fieldset',
  FROM: 'from',
  TO: 'to',
  FROMEACH: 'fromEach'
};

const mapWithTemplate = (sourceFile, xformTemplateFile) => {
  const source = readJSON(sourceFile);
  const xformTemplate = readJSON(xformTemplateFile);

  return mapSourceToTarget(source, xformTemplate);
};

const mapToNewObject = (source, xFormTemplate) => {
  return traverseTemplate(source, xFormTemplate);
};

const traverseFromEach = (source, xFormTemplate, prop, target) => {
  const fromEachRef = xFormTemplate[prop];
  const field = fromEachRef.field;
  const to = fromEachRef.to || field;
  const fieldData = queryAll(source, field);
  target[to] = new Array();
  for (const prop in fromEachRef) {
    if (prop === commands.FROMEACH) {
      target[to].push(traverseFromEach(fieldData, fromEachRef, prop, {}));
    }
    if (prop === commands.FIELDSET) {
      for (fieldset of fromEachRef[prop]) {
        for (const item of fieldData) {
          if (!Object.keys(item).find((k) => {return fieldset.from === k})) {
            continue;
          }
          const fromItem = fieldset.from;
          const toItem = fieldset.to || fromItem;
          const fromValue = querySingleProp(item, fromItem);
          let currentTarget = addPropToTarget({}, toItem, fromValue);
          target[to].push(currentTarget);
        }
      }
    }
  }
  return target;
};

const traverseFieldset = (source, template, prop, target) => {
  template[prop].forEach((item) => {
    if (item.fromEach) {
      target = {...target, ...traverseFromEach(source, item, 'fromEach', target)};
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
  let target = {};
  for (const prop in xFormTemplate) {
    let currentTarget;
    if (prop === commands.FIELDSET) {
      currentTarget = traverseFieldset(source, xFormTemplate, prop, target);
    } else if (prop === commands.FROMEACH) {
      currentTarget = traverseFromEach(source, xFormTemplate, prop, target);
    }
    target = { ...target, ...currentTarget };
  }
  return target;
};

module.exports = { mapToNewObject, mapWithTemplate, traverseTemplate };
