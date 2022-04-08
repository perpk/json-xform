const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

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
          myNestedProp: 'myNestedPropValue',
          myOtherNestedProp: 'myOtherNestedPropValue'
        }
      ]
    };
    const target = {
      yourProp: 'myValue',
      yourField: [
        {
          yourNestedProp: 'myNestedPropValue',
          yourOtherNestedProp: 'myOtherNestedPropValue'
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should correctly map an object with a fieldset and a fromEach with a nested fromEach to a target object', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'myProp',
          to: 'yourProp',
          fromEach: {
            field: 'firstLevelGroup',
            fromEach: {
              field: 'secondLevelGroup',
              fieldset: [
                {
                  from: 'myVeryNestedProp',
                  to: 'yourVeryNestedProp'
                },
                {
                  from: 'myOtherVeryNestedProp',
                  to: 'yourOtherVeryNestedProp'
                }
              ]
            }
          }
        }
      ]
    };
    const source = {
      myProp: 'myValue',
      firstLevelGroup: [
        {
          secondLevelGroup: [
            {
              myVeryNestedProp: 'myVeryNestedValue',
              noInterestedIn: 'this value'
            },
            {
              myOtherVeryNestedProp: 'myOtherVeryNestedValue',
              alsoNotInterestedIn: 'that value'
            }
          ]
        }
      ]
    };
    const target = {
      yourProp: 'myValue',
      firstLevelGroup: [
        {
          secondLevelGroup: [
            {
              yourVeryNestedProp: 'myVeryNestedValue'
            },
            {
              yourOtherVeryNestedProp: 'myOtherVeryNestedValue'
            }
          ]
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should correctly map nested fromEach blocks with fieldsets within', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'levelOne',
            fieldset: [
              {
                fromEach: {
                  field: 'array',
                  fieldset: [
                    {
                      from: 'levelTwo'
                    },
                    {
                      from: 'sameAsLevelTwo'
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
    const source = {
      levelOne: [
        {
          array: [
            {
              levelTwo: "here's level two :2 y'all!",
              sameAsLevelTwo: "I'm at the same level as 2"
            },
            {
              levelTwo: "Here's another level two!",
              sameAsLevelTwo: 'And the same thing again!!!'
            }
          ]
        }
      ]
    };
    const target = {
      levelOne: [
        {
          array: [
            {
              levelTwo: "here's level two :2 y'all!",
              sameAsLevelTwo: "I'm at the same level as 2"
            },
            {
              levelTwo: "Here's another level two!",
              sameAsLevelTwo: 'And the same thing again!!!'
            }
          ]
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});
