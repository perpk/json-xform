const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Special non-word characters in the source object', () => {
  it('should perform the mapping correctly also if property names start with a non-word char', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'name'
        },
        {
          from: '$job',
          to: 'myJob'
        }
      ]
    }
    const source = {
      name: 'Mark',
      $job: 'programmer'
    }
    const target = {
      name: 'Mark',
      myJob: 'programmer'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should perform the mapping correctly also if non-word chars are mixed within the property names', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: '_name'
        },
        {
          from: '$j&ob',
          to: 'myJob'
        }
      ]
    }
    const source = {
      _name: 'Mark',
      '$j&ob': 'programmer'
    }
    const target = {
      _name: 'Mark',
      myJob: 'programmer'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should perform mapping from nested expressions with non-word chars correctly', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: '$data.fullName',
          to: 'name'
        },
        {
          from: '$data.$occupation',
          to: 'occupation'
        },
        {
          from: '$data.$age.value',
          to: 'ageValue'
        },
        {
          from: '$data.town.$name',
          to: '$town.name'
        },
        {
          from: '$data.town.$name',
          to: '$addressTown'
        }
      ]
    }
    const source = {
      $data: {
        fullName: 'theName',
        $occupation: 'dvlpr',
        $age: { value: 12 },
        town: { $name: 'Berlin' }
      }
    }
    const target = {
      name: 'theName',
      occupation: 'dvlpr',
      ageValue: 12,
      $town: {
        name: 'Berlin'
      },
      $addressTown: 'Berlin'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })
})
