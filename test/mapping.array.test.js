const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('Mapping to a new field which holds an array', () => {
  it('should place a single value from the source object into the target array', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'field',
          to: 'array',
          toArray: true
        }
      ]
    };
    const source = {
      field: 'value'
    };
    const target = {
      array: ['value']
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should place a single value from a chained property into an array in the target', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'field.level.one',
          to: 'array',
          toArray: true
        }
      ]
    };
    const source = {
      field: {
        level: {
          one: 'value'
        }
      }
    };
    const target = {
      array: ['value']
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should place a single value from a property into an array within a nested structure', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'field',
          to: 'root.level.one',
          toArray: true
        }
      ]
    };
    const source = {
      field: 'value'
    };
    const target = {
      root: {
        level: {
          one: ['value']
        }
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});
