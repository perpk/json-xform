const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Mapping with chaining in the target field', () => {
  it('should map a primitive typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'random',
          to: 'object.random'
        }
      ]
    }
    const source = {
      random: 'value'
    }
    const target = {
      object: {
        random: 'value'
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should map an array typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'array',
          to: 'object.array'
        }
      ]
    }
    const source = {
      array: [1, 2, 3, 4, 5]
    }
    const target = {
      object: {
        array: [1, 2, 3, 4, 5]
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should map an object typed value into a new object in the target field', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'object',
          to: 'objectWrapper.newObject'
        }
      ]
    }
    const source = {
      object: {
        propOne: 1,
        propTwo: 'two',
        propThree: [1, 2, 3, 'banana']
      }
    }
    const target = {
      objectWrapper: {
        newObject: {
          propOne: 1,
          propTwo: 'two',
          propThree: [1, 2, 3, 'banana']
        }
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should map nested object properties to new properties', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'object.propOne',
          to: 'objectWrapper.newObject.newPropOne'
        },
        {
          from: 'object.propTwo',
          to: 'objectWrapper.newObject.newPropTwo'
        },
        {
          from: 'object.propThree',
          to: 'objectWrapper.newObject.newPropThree'
        }
      ]
    }
    const source = {
      object: {
        propOne: 1,
        propTwo: 'two',
        propThree: [1, 2, 3, 'banana']
      }
    }
    const target = {
      objectWrapper: {
        newObject: {
          newPropOne: 1,
          newPropTwo: 'two',
          newPropThree: [1, 2, 3, 'banana']
        }
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it("should inherit nesting from source if no 'to' field is specified", () => {
    const xFormTemplate = {
      fieldset: [
        { from: 'objectWrapper.object.firstProp' },
        { from: 'objectWrapper.object.secondProp' },
        { from: 'objectWrapper.object.thirdProp' }
      ]
    }
    const source = {
      objectWrapper: {
        object: {
          firstProp: '1st value',
          secondProp: '2nd value',
          thirdProp: '3rd value'
        }
      }
    }
    const target = {
      objectWrapper: {
        object: {
          firstProp: '1st value',
          secondProp: '2nd value',
          thirdProp: '3rd value'
        }
      }
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })
})
