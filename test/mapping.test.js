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

describe('Mapping with chaining in the target field', () => {
  it('should map a primitive typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'random',
          to: 'object.random'
        }
      ]
    };
    const source = {
      random: 'value'
    };
    const target = {
      object: {
        random: 'value'
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should map an array typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'array',
          to: 'object.array'
        }
      ]
    };
    const source = {
      array: [1, 2, 3, 4, 5]
    };
    const target = {
      object: {
        array: [1, 2, 3, 4, 5]
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should map an object typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'object',
          to: 'objectWrapper.newObject'
        }
      ]
    };
    const source = {
      object: {
        propOne: 1,
        propTwo: 'two',
        propThree: [1, 2, 3, 'banana']
      }
    };
    const target = {
      objectWrapper: {
        newObject: {
          propOne: 1,
          propTwo: 'two',
          propThree: [1, 2, 3, 'banana']
        }
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should map nested object properties to new properties', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'object.propOne',
          to: 'objectWrapper.newObject.newPropOne'
        },
        {
          from: 'object.propTwo',
          to: 'objectWrapper.newObject.newPropTwo'
        },
        {
          from: 'object.propThree',
          to: 'objectWrapper.newObject.newPropThree'
        }
      ]
    };
    const source = {
      object: {
        propOne: 1,
        propTwo: 'two',
        propThree: [1, 2, 3, 'banana']
      }
    };
    const target = {
      objectWrapper: {
        newObject: {
          newPropOne: 1,
          newPropTwo: 'two',
          newPropThree: [1, 2, 3, 'banana']
        }
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it("should inherit nesting from source if no 'to' field is specified", () => {
    const xFormTemplate = {
      fieldset: [
        { from: 'objectWrapper.object.firstProp' },
        { from: 'objectWrapper.object.secondProp' },
        { from: 'objectWrapper.object.thirdProp' }
      ]
    };
    const source = {
      objectWrapper: {
        object: {
          firstProp: '1st value',
          secondProp: '2nd value',
          thirdProp: '3rd value'
        }
      }
    };
    const target = {
      objectWrapper: {
        object: {
          firstProp: '1st value',
          secondProp: '2nd value',
          thirdProp: '3rd value'
        }
      }
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});

describe('Testing repetition groups', () => {
  it('should successfully take over properties mapped in a fromEach repetition group to a new object', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'repetitionGroup',
            fieldset: [
              {
                from: 'singleProperty'
              }
            ]
          }
        }
      ]
    };
    const source = {
      repetitionGroup: [
        {
          propertyToIgnore: 'value to ignore',
          singleProperty: 'value to copy!'
        },
        {
          anotherPropertyToIgnore: 'value to ignore too',
          singleProperty: 'another value to copy!'
        }
      ]
    };
    const target = {
      repetitionGroup: [
        {
          singleProperty: 'value to copy!'
        },
        {
          singleProperty: 'another value to copy!'
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should successfully take over properties mapped in a fromEach repetition group to a new object with another name', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'repetitionGroup',
            to: 'newGroup',
            fieldset: [
              {
                from: 'singleProperty',
                to: 'newSingleProperty'
              }
            ]
          }
        }
      ]
    };
    const source = {
      repetitionGroup: [
        {
          propertyToIgnore: 'value to ignore',
          singleProperty: 'value to copy!'
        }
      ]
    };
    const target = {
      newGroup: [
        {
          newSingleProperty: 'value to copy!'
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});

describe('Testing complex object', () => {
  it('should correctly map an object with a fieldset and a fromEach to a target object', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'myProp',
          to: 'yourProp',
          fromEach: {
            field: 'myField',
            to: 'yourField',
            fieldset: [
              {
                from: 'myNestedProp',
                to: 'yourNestedProp'
              },
              {
                from: 'myOtherNestedProp',
                to: 'yourOtherNestedProp'
              }
            ]
          }
        }
      ]
    };
    const source = {
      myProp: 'myValue',
      myField: [
        {
          myNestedProp: 'myNestedPropValue'
        },
        {
          myOtherNestedProp: 'myOtherNestedPropValue'
        }
      ]
    };
    const target = {
      yourProp: 'myValue',
      yourField: [
        {
          yourNestedProp: 'myNestedPropValue'
        },
        {
          yourOtherNestedProp: 'myOtherNestedPropValue'
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should correctly map an object with a fieldset and a fromEach with a nested fromEach to a target object', () => {});
});
