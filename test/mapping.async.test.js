const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe, it } = require('mocha')

const { mapToNewObjectAsync, mapWithTemplateAsync } = require('../utils/mapping')

chai.use(chaiAsPromised)
chai.should()

describe('Mapping via Async API functions', () => {
  it('Should work as expected for an arbitrary transformation', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'field',
          to: 'array',
          toArray: true
        }
      ]
    }
    const source = {
      field: 'value'
    }
    const target = {
      array: ['value']
    }

    mapToNewObjectAsync(source, xFormTemplate).should.eventually.eqls(
      target
    )
  })

  it('Should work by resolving the promise instead of awaing the result', async () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'field',
          to: 'array',
          toArray: true
        }
      ]
    }
    const source = {
      field: 'value'
    }
    const target = {
      array: ['value']
    }

    await mapToNewObjectAsync(source, xFormTemplate).should.eventually.eqls(target)
  })

  it('Should throw an error in case improper parameters are passed', async () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'property.anotherDatefield',
          via: {
            type: 'invalidType',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-mm'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10-03'
    }
    const errorMsg =
      'An error occured during transformation Error: instance.fieldset[0].via.type is not one of enum values: date'

    await mapToNewObjectAsync(source, xFormTemplate).should.be.rejectedWith(
      errorMsg
    )
  })

  it('Should throw an error in case improper parameters are passed and the promise is expected', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'property.anotherDatefield',
          via: {
            type: 'invalidType',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-mm'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10-03'
    }
    const errorMsg =
      'An error occured during transformation Error: instance.fieldset[0].via.type is not one of enum values: date'

    return Promise.resolve(
      mapToNewObjectAsync(source, xFormTemplate).should.be.rejectedWith(errorMsg))
  })
})

describe('Map asynchronously with template from file', () => {
  it('should transform a file via template asynchronously', async () => {
    const result = mapWithTemplateAsync(
      `${__dirname}/mocks/simple-source.json`,
      `${__dirname}/mocks/simple-template.json`
    )

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
    }
    await result.should.eventually.eqls(target)
  })

  it('should throw an error tranformation fails', async () => {
    const result = mapWithTemplateAsync(
      `${__dirname}/mocks/error-source.json`,
      `${__dirname}/mocks/error-template-array.json`
    )
    await result.should.be.rejected
  })
})
