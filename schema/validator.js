const { schema } = require('./schema');
const validate = require('jsonschema').validate;

const validateWithSchema = (jsonToValidate) => {
  return validate(jsonToValidate, schema);
};

const validationUtil = {
  getErrorMessage: (result) => {
    return result.errors.map((error) => {
      return error.stack;
    }).reduce((acc, curr) => {
        return `${acc}\n${curr}`;
    });
  }
};

module.exports = { validateWithSchema, validationUtil };
