const addPropToTarget = (target, property, propertyValue) => {
  const newTarget = { ...target };
  if (property.indexOf('.') >= 0) {
    const parts = property.split('.');
    addPropRecursive(parts, newTarget, propertyValue);
  } else if (!newTarget[property]) {
    newTarget[property] = propertyValue;
  }
  return newTarget;
};

const addPropRecursive = (elems, target, value) => {
  let current = elems.shift();
  if (!current) {
    target = value;
    return target;
  }
  if (!target[current]) {
    target[current] = {};
  }
  target[current] = addPropRecursive(elems, target[current], value, current);
  return target;
};

module.exports = { addPropToTarget };
