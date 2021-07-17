const { expect } = require('chai');
const { describe, it } = require('mocha');
const {
  querySingleProp,
  queryAll,
  queryArrayElements
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
