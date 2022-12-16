const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('Mapping based on a value', () => {
  it('should use the specified value from the source object as a prop key in the target', () => {
    const xFormTemplate = {
        fieldset: [
            {
                from: 'name',
                valueToKey: true,
                withValueFrom: 'age'
            }
        ]
    };

    const source = {
        name: 'Constantine',
        age: 41
    };

    const target = {
        Constantine: 41
    };

    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should use the specified values from the source array as a prop key in the target', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'content',
            fieldset: [
              {
                from: 'type',
                valueToKey: true,
                withValueFrom: 'value'
              }
            ]
          }
        }
      ]
    };

    const source = {
      content: [
        {
          type: 'text',
          value: 'MyText'
        },
        {
          type: 'number',
          value: 'onehundred'
        }
      ]
    };

    const target = {
      content: [{ text: 'MyText' }, { number: 'onehundred' }]
    };

    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should support nesting', () => {
    const xFormTemplate = {
        fieldset: [
            {
                from: 'key',
                valueToKey: true,
                withValueFrom: 'value.deeper.abitdeeper.righthere'
            }
        ]
    };

    const source = {
        key: 'a_key_to_a_nested_value',
        value: {
            deeper: {
                abitdeeper: {
                    righthere: 'a_nested_value_to_a_key'
                }
            }
        }
    };

    const target = {
        a_key_to_a_nested_value: 'a_nested_value_to_a_key'
    };

    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should work with data Formatting', () => {
    const xFormTemplate = {
        fieldset: [
            {
                from: "key",
                valueToKey: true,
                withValueFrom: 'value',
                via: {
                    type: 'date',
                    format: 'dd/mm/yyyy',
                    sourceFormat: 'yyyy-dd-mm'
                }
            }
        ]
    };

    const source = {
        key: 'When',
        value: '1981-10-03'
    };

    const target = {
        When: '10/03/1981'
    };

    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});
