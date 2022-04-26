const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('Use a template for the target value', () => {
  it('should accept a template to transform several fields from the source into a new single field in the target', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newname',
          withTemplate: '`${firstname} ${lastname}`'
        }
      ]
    };
    const source = {
      firstname: 'Firstname',
      lastname: 'Lastname'
    };
    const target = {
      newname: 'Firstname Lastname'
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});
