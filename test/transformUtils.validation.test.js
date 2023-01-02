const { expect } = require('chai')
const { describe, it } = require('mocha')

const rewire = require('rewire')
const transformUtils = rewire('../utils/transformUtils.js')

const validate = transformUtils.__get__('validateTransformationRules')

describe('Validations work as expected', () => {
  const validationErrorPrototypeDetected =
    'Usage __proto__, prototype is not supported'

  const validationErrorFunctionDetected =
    'Functions are not supported in transformation rules'

  it('should successfully validate a transformation ruleset', () => {
    const transform = [
      {
        command: 'toString'
      },
      {
        command: 'split',
        params: [',']
      },
      {
        command: 'trim'
      }
    ]

    expect(validate(transform)).to.not.throw
  })

  it('should recognize __proto__ in the command property and fail validation', () => {
    const transform = [
      {
        command: '__proto__'
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)
  })

  it('should recognize prototype in the command property and fail validation', () => {
    const transform = [{ command: 'prototype' }]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)
  })

  it('should recognize __proto__ in the parameters property and fail validation', () => {
    let transform = [
      {
        command: 'set',
        params: ['__proto__', 1, 2, 3]
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)

    transform = [
      {
        command: 'set',
        params: [1, '__proto__', 2, 3]
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)

    transform = [
      {
        command: 'set',
        params: [1, 2, 3, '__proto__']
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)
  })

  it('should recognize invalid commands or props across several transformation rules in the set', () => {
    let transform = [
      {
        command: 'toString'
      },
      {
        command: 'trim'
      },
      {
        command: 'splice',
        params: ['2', '1', '__proto__']
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorPrototypeDetected)

    transform = [
      {
        command: 'toString'
      },
      {
        command: 'trim'
      },
      {
        command: 'splice',
        params: ['2', '1', 'test']
      },
      {
        command: 'set',
        params: [
          () => {
            return 'malice >:)'
          }
        ]
      },
      {
        command: 'substring',
        params: ['1', '2']
      }
    ]
    expect(() => validate(transform)).to.throw(validationErrorFunctionDetected)
  })
})
