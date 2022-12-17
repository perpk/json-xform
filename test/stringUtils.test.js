const { expect } = require('chai')
const { describe, it } = require('mocha')

const { pickTemplateVarsFromString } = require('../utils/stringUtils')

describe('Pick template variables from a string', () => {
  it('should pick a template variable from a string', () => {
    const expected = ['varname']
    const source = 'This is a template ${varname}'
    const result = pickTemplateVarsFromString(source)
    expect(result).to.eqls(expected)
  })

  it('should pick all variables defined in a string', () => {
    const expected = ['varname_1', 'varname_2']
    const source = 'This is ${varname_1} another ${varname_2}'
    const result = pickTemplateVarsFromString(source)
    expect(result).to.eqls(expected)
  })

  it('shouldn\'t fail when no match is detected', () => {
    const expected = []
    const source = 'Nothing here!'
    const result = pickTemplateVarsFromString(source)
    expect(result).to.eqls(expected)
  })

  it('should pick variables which contain allowed special chars (_.$)', () => {
    const expected = ['$varname_1.$test._one', '$varname_2.$test._two', '_varname_3.$.__three$']
    const source = 'Now this ${$varname_1.$test._one} is something ${$varname_2.$test._two} quite complicated ${_varname_3.$.__three$} innit?'
    const result = pickTemplateVarsFromString(source)
    expect(result).to.eqls(expected)
  })
})
