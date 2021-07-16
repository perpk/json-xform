const {schema} = require('./schema');
const validate = require('jsonschema').validate;

const validateWithSchema = (jsonToValidate) => {
    return validate(jsonToValidate, schema);
};

module.exports = {validateWithSchema};