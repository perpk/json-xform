const { expect } = require('chai')
const { describe, it } = require('mocha')

const rewire = require('rewire')
const transformUtils = rewire('../utils/transformUtils.js')

const invokeRules = transformUtils.__get__('invokeRulesRecursively')

describe('Transformation over a single rule', () => {
  it('should apply the parameter-less command from the rule', () => {
    const transform = [
      {
        command: 'toUpperCase'
      }
    ]
    expect(invokeRules('test', transform)).to.eq('TEST')
  })

  it('should apply the parametrized command from the rule', () => {
    const transform = [
      {
        command: 'split',
        params: [',']
      }
    ]
    expect(invokeRules('test,eins,zwei', transform)).to.eqls([
      'test',
      'eins',
      'zwei'
    ])
  })
})

describe('Transformation over several rules', () => {
  it('should apply several rules from top to bottom', () => {
    let transform = [
      {
        command: 'toUpperCase'
      },
      {
        command: 'split',
        params: [',']
      }
    ]
    expect(invokeRules('test,un,deux', transform)).to.eqls([
      'TEST',
      'UN',
      'DEUX'
    ])

    transform = [
      {
        command: 'split',
        params: [',']
      },
      {
        command: 'at',
        params: [1]
      }
    ]
    expect(invokeRules('test,un,deux', transform)).to.eqls('un')
  })
})
