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

const traverseFromEach = () => {
  // TODO implement me!
  throw Error('Not implemented yet!');
};

const traverseFieldset = (source, template, prop, target) => {
  template[prop].forEach((item) => {
    if (item.fromEach) {
      traverseFromEach();
    }

    template[prop].forEach((item) => {
      const from = item.from;
      const to = item.to || item.from;

      const fromValue = querySingleProp(source, from);
      let currentTarget = addPropToTarget(target, to, fromValue);
      target = { ...target, ...currentTarget };
    });
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
      currentTarget = traverseFromEach();
    }
    target = {...target, ...currentTarget};
  }
  return target;
};

module.exports = { mapToNewObject, mapWithTemplate, traverseTemplate };
