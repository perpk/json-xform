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
  object[fieldset].forEach((item) => {
    traverseFormTemplate(item);
  });
};

const traverseFormTemplate = (formTemplate, input, target) => {
  for (const prop in formTemplate) {
    if (prop === commands.FIELDSET) {
      console.log(form)
      return traverseFieldset(formTemplate, prop, input, {});
    }
    if (prop === commands.FROMEACH) {
      return traverseFormTemplate(formTemplate[prop]);
    }
    console.log(`${prop}: ${formTemplate[prop]}`);
  }
};

traverseFormTemplate(xformTemplate, input, {});
