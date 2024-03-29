const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Testing repetition groups', () => {
  it('should successfully take over properties mapped in a fromEach repetition group to a new object', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'repetitionGroup',
            fieldset: [
              {
                from: 'singlePropertyOne'
              },
              {
                from: 'singlePropertyTwo'
              }
            ]
          }
        }
      ]
    }
    const source = {
      repetitionGroup: [
        {
          propertyToIgnore: 'value to ignore',
          singlePropertyOne: 'value to copy!'
        },
        {
          anotherPropertyToIgnore: 'value to ignore too',
          singlePropertyTwo: 'another value to copy!'
        }
      ]
    }
    const target = {
      repetitionGroup: [
        {
          singlePropertyOne: 'value to copy!'
        },
        {
          singlePropertyTwo: 'another value to copy!'
        }
      ]
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should successfully take over properties mapped in a fromEach repetition group to a new object with another name', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'repetitionGroup',
            to: 'newGroup',
            fieldset: [
              {
                from: 'singleProperty',
                to: 'newSingleProperty'
              }
            ]
          }
        }
      ]
    }
    const source = {
      repetitionGroup: [
        {
          propertyToIgnore: 'value to ignore',
          singleProperty: 'value to copy!'
        }
      ]
    }
    const target = {
      newGroup: [
        {
          newSingleProperty: 'value to copy!'
        }
      ]
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should not create empty objects in the result', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'food',
            fieldset: [
              {
                from: 'provatina',
                to: 'favorites.foods'
              }
            ]
          }
        }
      ]
    }
    const source = {
      food: [
        {
          bananas: '2€',
          countryOfOrigin: 'Nicaragua'
        },
        {
          asparagus: '5€',
          countryOfOrigin: 'Romania'
        },
        {
          provatina: '10€',
          countryOfOrigin: 'Greece'
        }
      ]
    }

    const result = mapToNewObject(source, xFormTemplate)
    expect(result.food.length).to.eq(1)
    expect(result.food[0]).not.to.be.empty
  })
})
