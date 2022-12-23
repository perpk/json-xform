const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { describe, it } = require('mocha')

const { mapToNewObjectAsync } = require('../utils/mapping')

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
