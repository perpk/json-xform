const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Transforming an Array of objects into an Array of primitives', () => {
  it('Should pick primitives from the objects and create an array in the target object containing those literals', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'users',
            to: 'ages',
            flatten: true,
            fieldset: [
              {
                fromEach: { field: 'age' }
              }
            ]
          }
        }
      ]
    }

    const source = {
      users: [
        {
          name: 'Mike',
          age: 31
        },
        {
          name: 'Aaron',
          age: 42
        },
        {
          name: 'Eddie',
          age: 38
        }
      ]
    }

    const target = {
      ages: [31, 42, 38]
    }

    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })
})
