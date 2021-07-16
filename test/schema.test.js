const { expect } = require('chai');
const { describe, it } = require('mocha');

const { validateWithSchema } = require('../schema/validator');

describe('Successful validations of correct JSON mappings :)', () => {
  it('should validate a simple mapping with only mandatory fields successfully', () => {
    const jsonToValidate = {
      fieldset: [{ from: 'source' }]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });

  it('should validate a simple mapping with an additional optional field successfully', () => {
    const jsonToValidate = {
      fieldset: [{ from: 'source', to: 'target' }]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });

  it('should validate a mapping with a fromEach group successfully if the mandatory field(s) are in place', () => {
    const jsonToValidate = {
      fieldset: [
        {
          fromEach: {
            field: 'fromEachField'
          }
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });

  it('should validate a complex mapping successfully', () => {
    const complexJsonToValidate = {
      fieldset: [
        {
          from: 'source',
          to: 'target',
          fromEach: {
            field: 'fromEachField',
            fieldset: [
              { from: 'sourceOne', to: 'targetOne' },
              { from: 'sourceTwo', to: 'targetTwo' },
              { from: 'sourceSameAsTarget' }
            ]
          }
        },
        {
          from: 'anotherSource',
          to: 'anotherTarget'
        }
      ]
    };
    const result = validateWithSchema(complexJsonToValidate);
    expect(result.valid).to.true;
  });
});

describe('Unsuccessful validations of correct JSON mappings :(', () => {
  it('should find a JSON invalid if it is empty', () => {
    const jsonToValidate = {};
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it('should find a JSON invalid if it contains a mapping with an unknown field', () => {
    const jsonToValidate = { unknownField: 'unknown' };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it('should find a JSON invalid if it contains an empty fieldset', () => {
    const jsonToValidate = { fieldset: [] };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it('should find a JSON invalid if fieldset contain only one non-mandatory field', () => {
    const jsonToValidate = {fieldset: [{to: 'targetField'}]};
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it ('should find a JSON invalid if the fromEach block doesn\'t contain the mandatory field(s)', () => {
    const jsonToValidate = {
        fieldset: [
            {
                fromEach: {
                    to: 'fromEachTargetField',
                    fieldset: [
                        {
                            from: 'this field',
                            to: 'that field'
                        }
                    ]
                }
            }
        ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });
});
