const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Reformat a date from the source', () => {
  it('should reformat with the given format in the mapping', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-mm'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10-03'
    }
    const target = {
      anotherDatefield: '10/03/1981'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should reformat properly also when time is provided', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/MM/yyyy p',
            sourceFormat: 'yyyy-dd-MM HH:mm:ss'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10-03 17:25:00'
    }
    const target = {
      anotherDatefield: '10/03/1981 5:25 PM'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should format dates referenced in a template', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'template',
          withTemplate: 'It was on the ${theDate} not ${theOtherDate}',
          via: {
            type: 'date',
            format: 'dd/MM/yyyy',
            sourceFormat: 'yyyy-dd-MM'
          }
        }
      ]
    }
    const source = {
      theDate: '1981-10-03',
      theOtherDate: '1982-12-12'
    }
    const target = {
      template: 'It was on the 10/03/1981 not 12/12/1982'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should format dates from chained prop references', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'property.dateField',
          to: 'anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/MM/yyyy p',
            sourceFormat: 'yyyy-dd-MM HH:mm:ss'
          }
        }
      ]
    }
    const source = {
      property: {
        dateField: '1981-10-03 17:25:00'
      }
    }
    const target = {
      anotherDatefield: '10/03/1981 5:25 PM'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should format dates into nested properties in target object', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'property.anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-mm'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10-03'
    }
    const target = {
      property: {
        anotherDatefield: '10/03/1981'
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should fail if a wrongly formatted date is provided as input', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'property.anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-mm'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10'
    }
    const errorMsg =
      'Invalid time value error occured when trying to format 1981-10 with dd/mm/yyyy'
    expect(() => mapToNewObject(source, xFormTemplate)).to.throw(errorMsg)
  })

  it('should fail if a wrongly formatted date is provided as input', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'dateField',
          to: 'property.anotherDatefield',
          via: {
            type: 'date',
            format: 'dd/mm/yyyy',
            sourceFormat: 'yyyy-dd-sdadsad'
          }
        }
      ]
    }
    const source = {
      dateField: '1981-10'
    }
    const errorMsg =
      'Invalid time value error occured when trying to format 1981-10 with dd/mm/yyyy'
    expect(() => mapToNewObject(source, xFormTemplate)).to.throw(errorMsg)
  })

  it('should run an arbitrary operation on a field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'lowercase',
          to: 'uppercase',
          via: {
            type: 'custom',
            format: 'toUpperCase'
          }
        }
      ]
    }

    const source = {
      lowercase: 'uppercase'
    }

    const target = {
      uppercase: 'UPPERCASE'
    }

    expect(mapToNewObject(source, xFormTemplate)).to.eqls(target)
  })
})
