const jsonpath = require('jsonpath');

const querySingleProp = (json, prop) => {
  return jsonpath.query(json, '$.' + prop)[0];
};

const queryAll = (json, prop) => {
  return jsonpath.query(json, '$..' + prop)[0];
};

const queryArrayElements = (json, array, prop) => {
  return jsonpath.query(json, '$.' + array + '..' + prop);
};

module.exports = { querySingleProp, queryAll, queryArrayElements };
