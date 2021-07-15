const fs = require('fs');
const jp = require('jsonpath');
const xformTemplateFile = fs.readFileSync('./xformTemplate.json', 'UTF8');
const xformTemplate = JSON.parse(xformTemplateFile);

const commands = {
  FIELDSET: 'fieldset',
  FROM: 'from',
  TO: 'to',
  FROMEACH: 'fromEach'
};

const inputFile = fs.readFileSync('./dependency-check-report.json', 'UTF8');
const input = JSON.parse(inputFile);

const traverseFieldset = (object, fieldset, input, target) => {
  const from = object['from'];
  let to = object['to'];

  if (!to) {
    to = from.slice();
  }

  if (Object.keys(target).length === 0) {
  }

  object[fieldset].forEach((item) => {
    traverseFormTemplate(item);
  });
};

const traverseFormTemplate = (formTemplate, input, target) => {
  for (const prop in formTemplate) {
    if (prop === commands.FIELDSET) {
      return traverseFieldset(formTemplate, prop, input, {});
    }
    if (prop === commands.FROMEACH) {
      return traverseFormTemplate(formTemplate[prop]);
    }
    console.log(`${prop}: ${formTemplate[prop]}`);
  }
};

const addPropToTarget = (target, property, propertyValue) => {
    const newTarget = {...target};
    if (property.indexOf('.') >= 0) {
        const parts = property.split('.');
        addPropRecursive(parts, newTarget, propertyValue);
    } else if (!newTarget[property]) {
      newTarget[property] = propertyValue;
    }
    return newTarget
}

const addPropRecursive = (elems, target, value, prop) => {
  let current = elems.shift();
  if (!current) {
    target = value;
    return target;
  }
  target[current] = {};
  target[current] = addPropRecursive(elems, target[current], value, current);
  return target;
}

// traverseFormTemplate(xformTemplate, input, {});
