const { expect, assert } = require('chai');
const { describe, it, before, after } = require('mocha');

const rewire = require('rewire');
const index = rewire('../index.js');
const addPropToTarget = index.__get__('addPropToTarget');

describe('Adding a property to an empty target object', () => {
  it('should add a primitive field', () => {
    const target = {};
    const property = 'one';
    const propertyValue = 1;

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({ one: 1 });
  });

  it('should add an object field', () => {
    const target = {};
    const property = 'object';
    const propertyValue = { a: 'gorilla' };

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({ object: { a: 'gorilla' } });
  });

  it('should add an array field', () => {
    const target = {};
    const property = 'array';
    const propertyValue = ['a', 'lot', 'of', 'gorillas'];

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({ array: ['a', 'lot', 'of', 'gorillas'] });
  });

  it('should add a property chain', () => {
    const target = {};
    const property = 'parentProp.childProp.grandchildProp';
    const propertyValue = 'Hi, Grandpa!';

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({
      parentProp: { childProp: { grandchildProp: 'Hi, Grandpa!' } }
    });
  });
});

describe('Adding a property to a non-empty object', () => {
  it('should add a primitive field', () => {
    const target = { initalProp: 'initial value' };
    const property = 'one';
    const propertyValue = 1;

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({ one: 1, initalProp: 'initial value' });
  });

  it('should add an object field', () => {
    const target = { initalProp: 'initial value' };
    const property = 'object';
    const propertyValue = { a: 'gorilla' };

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({
      object: { a: 'gorilla' },
      initalProp: 'initial value'
    });
  });

  it('should add an array field', () => {
    const target = { initalProp: 'initial value' };
    const property = 'array';
    const propertyValue = ['a', 'lot', 'of', 'gorillas'];

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({
      array: ['a', 'lot', 'of', 'gorillas'],
      initalProp: 'initial value'
    });
  });

  it('should add a property chain', () => {
    const target = { initalProp: 'initial value' };
    const property = 'parentProp.childProp.grandchildProp';
    const propertyValue = 'Hi, Grandpa!';

    const newTarget = addPropToTarget(target, property, propertyValue);
    expect(newTarget).to.eql({
      parentProp: { childProp: { grandchildProp: 'Hi, Grandpa!' } },
      initalProp: 'initial value'
    });
  });
});
