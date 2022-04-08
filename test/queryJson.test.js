const { expect } = require('chai');
const { describe, it } = require('mocha');
const {
  querySingleProp,
  queryAll,
  queryArrayElements,
  constructQueryForProp
} = require('../utils/queryJson');

describe('Query properties from a JSON file', () => {
  it('should query a top-level property successfully', () => {
    const json = {
      levelOne: {
        levelOneProp: 'levelOneValue'
      }
    };
    const propValue = querySingleProp(json, 'levelOne.levelOneProp');
    expect(propValue).to.equal('levelOneValue');
  });

  it('should query all elements of an array', () => {
    const json = {
      arrayProp: [
        {
          arrayElementOne: 'value one'
        },
        {
          arrayElementTwo: 'value two'
        },
        {
          arrayElementThree: 'value three'
        }
      ]
    };
    const result = queryAll(json, 'arrayProp');
    expect(result).to.equal(json.arrayProp);
  });

  it('should query all elements of an array nested in an object', () => {
    const json = {
      wrappingObject: {
        arrayProp: [
          {
            arrayElementOne: 'value one'
          },
          {
            arrayElementTwo: 'value two'
          },
          {
            arrayElementThree: 'value three'
          }
        ]
      }
    };
    const result = queryAll(json, 'wrappingObject.arrayProp');
    expect(result).to.equal(json.wrappingObject.arrayProp);
  });

  it('should get particular value out of an array of objects', () => {
    const json = {
      arrayProp: [
        {
          firstName: 'Milhouse',
          lastName: 'Van Houten',
          subobject: {
            address: '1242 Evergreen Terrace'
          }
        },
        {
          firstName: 'Martin',
          lastName: 'Prince',
          subobject: {
            address: '9803 Shelbyville Av.'
          }
        },
        {
          firstName: 'Carl',
          lastName: 'Carlson',
          subobject: {
            address: 'Monorail St. 4A'
          }
        }
      ]
    };
    const result = queryArrayElements(json, 'arrayProp', 'firstName');
    expect(result).to.eql(['Milhouse', 'Martin', 'Carl']);

    const subObjects = queryArrayElements(json, 'arrayProp', 'subobject');
    expect(subObjects).to.eql([
      { address: '1242 Evergreen Terrace' },
      { address: '9803 Shelbyville Av.' },
      { address: 'Monorail St. 4A' }
    ]);
  });
});

describe('Query based on non-word char chained props', () => {
  it('should correctly construct the query in case the root prop contains non-word chars', () => {
    const prop = '$data.fullName';

    const result = constructQueryForProp(prop);
    expect(result).to.eql("$['$data'].fullName");
  });

  it('should correctly construct the query in case root and child prop both contain non-word chars', () => {
    const prop = '$data.$occupation';

    const result = constructQueryForProp(prop);
    expect(result).to.eql("$['$data']['$occupation']");
  });

  it("should correctly construct the query when having a chain of three props the first two have non-word chars but the third doesn't", () => {
    const prop = '$data.$age.value';

    const result = constructQueryForProp(prop);
    expect(result).to.eql("$['$data']['$age'].value");
  });

  it("should correctly construct the query when having a chain of three props the root has non-word chars the middle doesn't and the last does", () => {
    const prop = '$data.town.$name';

    const result = constructQueryForProp(prop);
    expect(result).to.eql("$['$data'].town['$name']");
  });
});
