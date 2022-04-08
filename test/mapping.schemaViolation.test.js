const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('Schema violation errors', () => {
  it('should throw an error with a string typed message', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            to: 'fromEachTargetField',
            fieldset: [
              {
                to: 'that field'
              }
            ]
          }
        }
      ]
    };
    const source = {
      someProp: "doesn't really matter, since schema is invalid already :)"
    };
    const errorMsg =
      'instance.fieldset[0].fromEach.field is required\ninstance.fieldset[0].fromEach.fieldset[0] is not any of [subschema 0],[subschema 1]';
    expect(() => mapToNewObject(source, xFormTemplate)).to.throw(errorMsg);
  });
});
