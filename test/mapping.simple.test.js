const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('Mapping without chaining from specified from to target field', () => {
  const xFormTemplate = {
    fieldset: [
      {
        from: 'random'
      }
    ]
  };
  it('should map a primitive typed value', () => {
    const source = {
      random: 'value'
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(source);
  });

  it('should map an array typed value', () => {
    const source = {
      random: [1, 2, 3, 4]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(source);
  });

  it('should map an object typed value', () => {
    const source = {
      random: {
        object: 'and a value...'
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(source);
  });

  it('should map all types with a different name in the target', () => {
    const xFormTemplateAll = {
      fieldset: [
        {
          from: 'simpleValue',
          to: 'newSimpleValue'
        },
        {
          from: 'arrayValue',
          to: 'newArrayValue'
        },
        {
          from: 'objectValue',
          to: 'newObjectValue'
        }
      ]
    };
    const source = {
      simpleValue: 1,
      arrayValue: [1, 2, 3, 4],
      objectValue: {
        object: 'value'
      }
    };
    const target = {
      newSimpleValue: 1,
      newArrayValue: [1, 2, 3, 4],
      newObjectValue: {
        object: 'value'
      }
    };
    const newObject = mapToNewObject(source, xFormTemplateAll);
    expect(newObject).to.eqls(target);
  });
});
