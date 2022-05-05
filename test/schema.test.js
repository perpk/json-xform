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
            flatten: true,
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
    const jsonToValidate = { fieldset: [{ to: 'targetField' }] };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it("should find a JSON invalid if the fromEach block doesn't contain the mandatory field(s)", () => {
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

  it('should find a JSON invalid if the flatten mapping property is of the wrong type', () => {
    const jsonToValidate = {
      fieldset: [
        {
          fromEach: {
            field: 'fromField',
            to: 'fromEachTargetField',
            flatten: 2,
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

  it('should find a JSON valid if the fieldset lacks a from keyword but defines a withTemplate one', () => {
    const jsonToValidate = {
      fieldset: [
        {
          withTemplate: 'the template',
          to: 'targetField'
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });

  it('should find a JSON invalid if both from and withTemplate fields are present', () => {
    const jsonToValidate = {
      fieldset: [{ withTemplate: 'template', from: 'field', to: 'target' }]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it('should find a JSON valid if fromEach > fieldset lacks from but defines a withTemplate prop', () => {
    const jsonToValidate = {
      fieldset: [
        {
          fromEach: {
            field: 'from',
            fieldset: [
              {
                withTemplate: 'template',
                to: 'target'
              }
            ]
          }
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });

  it('should find a JSON invalid if fromEach > fieldset defines both from and withTemplate', () => {
    const jsonToValidate = {
      fieldset: [
        {
          fromEach: {
            field: 'from',
            fieldset: [
              {
                from: 'from',
                withTemplate: 'template',
                to: 'target'
              }
            ]
          }
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it("should find a JSON invalid if there's no 'to' prop when there's a withTemplate available", () => {
    const jsonToValidate = {
      fieldset: [
        {
          withTemplate: 'template'
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it("should find a JSON invalid if there's no 'to' prop in fieldset > fromEach when there's a withTemplate available", () => {
    const jsonToValidate = {
      fieldset: [
        {
          fromEach: {
            fieldset: [
              {
                withTemplate: 'template'
              }
            ]
          }
        }
      ]
    };
    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.false;
  });

  it('should find a JSON valid if the correct types are given in the withType prop', () => {
    const jsonToValidate = {
      fieldset: [
        {
          from: 'field',
          to: 'another',
          toArray: true
        }
      ]
    };

    const result = validateWithSchema(jsonToValidate);
    expect(result.valid).to.true;
  });
});
