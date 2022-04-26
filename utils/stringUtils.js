const pickTemplateVarsFromString = (theString) => {
  const matches = theString.match(/\${[A-Za-z$._0-9]+}/g);

  if (matches) {
    return matches.map((oc) => stripOffTemplateVarWrapper(oc));
  }
  return [];
};

const stripOffTemplateVarWrapper = (wrapped) => {
  return wrapped.substr(1).replace('{', '').replace('}', '');
};

const wrapInVarBraces = (unwrapped) => {
  return '${' + unwrapped + '}';
};

module.exports = { pickTemplateVarsFromString, wrapInVarBraces };
