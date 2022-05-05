const addPropToTarget = (target, property, propertyValue, toArray = false) => {
  const newTarget = { ...target };
  if (property.indexOf('.') >= 0) {
    const parts = property.split('.');
    addPropRecursive(parts, newTarget, propertyValue, toArray);
  } else if (!newTarget[property]) {
    newTarget[property] = toArray ? [propertyValue] : propertyValue;
  }
  return newTarget;
};

const addPropRecursive = (elems, target, value, toArray = false) => {
  let current = elems.shift();
  if (!current) {
    target = toArray ? [value] : value;
    return target;
  }
  if (!target[current]) {
    target[current] = {};
  }
  target[current] = addPropRecursive(elems, target[current], value, toArray);
  return target;
};

module.exports = { addPropToTarget };
