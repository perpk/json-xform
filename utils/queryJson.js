const jsonpath = require('jsonpath');

const querySingleProp = (json, prop) => {
  return jsonpath.query(json, constructQueryForProp(prop))[0];
};

const queryAll = (json, prop) => {
  return jsonpath.query(json, '$..' + prop)[0];
};

const queryArrayElements = (json, array, prop) => {
  return jsonpath.query(json, '$.' + array + '..' + prop);
};

const evaluateProp = (prop) => {
  if (!prop.match(/[^a-zA-Z0-9.]+/)) {
    return `.${prop}`;
  }
  return `['${prop}']`;
};

const constructQueryForProp = (prop) => {
  if (prop.indexOf('.') >= 0) {
    const parts = prop.split('.');
    const assembledQuery = assembleQueryRecursively(parts);
    return `$${assembledQuery.join('')}`;
  }

  return `$${evaluateProp(prop)}`;
};

const assembleQueryRecursively = (parts, currentQuery = null) => {
  if (!currentQuery) {
    currentQuery = new Array();
  }
  let current = parts.shift();
  if (!current) {
    return null;
  }
  currentQuery.push(evaluateProp(current));
  const nextOne = assembleQueryRecursively(parts, currentQuery)
  if (nextOne) {
    currentQuery.push(nextOne);
  }
  return currentQuery;
};

module.exports = {
  querySingleProp,
  queryAll,
  queryArrayElements,
  constructQueryForProp
};

// jsonpath.query(json, "$['$data'].fullName")[0];
// jsonpath.query(json, "$['$data']['$occupation']")[0];
// jsonpath.query(json, "$['$data']['$age'].value")[0];
// jsonpath.query(json, "$['$data'].town['$name']")[0];
