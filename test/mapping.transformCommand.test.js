const { expect } = require('chai')
const { describe, it } = require('mocha')
const { mapToNewObject } = require('../utils/mapping')

describe('Transformation via command work as expected', () => {
  it('should transform successfully with the given command', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'key',
          to: 'newKey',
          via: {
            type: 'commands',
            transform: [
              {
                command: 'toUpperCase'
              }
            ]
          }
        }
      ]
    }

    const source = {
      key: 'the key'
    }

    const target = {
      newKey: 'THE KEY'
    }

    expect(mapToNewObject(source, xFormTemplate)).to.eqls(target)
  })

  it('should successfully transform by using a series of commands', () => {
    const xFormTemplate = {
      fieldset: [
        {
          from: 'key',
          via: {
            type: 'commands',
            transform: [
              {
                command: 'split',
                params: [';']
              },
              {
                map: true,
                command: 'trim'
              },
              {
                map: true,
                command: 'toUpperCase'
              },
              {
                map: true,
                command: 'substring',
                params: [2]
              }
            ]
          }
        }
      ]
    }

    const source = {
      key: 'independent; invaluable; indispensable; inconvenient'
    }

    const target = {
      key: ['DEPENDENT', 'VALUABLE', 'DISPENSABLE', 'CONVENIENT']
    }

    expect(mapToNewObject(source, xFormTemplate)).to.eqls(target)
  })
})
