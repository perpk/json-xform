const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapWithTemplate } = require('../utils/mapping');

describe('Perform mapping with files for source and mapping template', () => {
  it('should transform the source file via a given template file and the output should match the expected one', () => {
    const result = mapWithTemplate(
      `${__dirname}/mocks/simple-source.json`,
      `${__dirname}/mocks/simple-template.json`
    );

    const target = {
      name: 'Peter',
      lastname: 'Parker',
      occupation: 'Hero with spider superpowers',
      address: {
        street: '31st Street',
        city: 'New York City',
        state: 'NY',
        postCode: '123-ABC'
      }
    };
    expect(result).to.eqls(target);
  });
});
