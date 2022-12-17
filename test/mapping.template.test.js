const { expect } = require('chai')
const { describe, it } = require('mocha')

const { mapToNewObject } = require('../utils/mapping')

describe('Use a template for the target value', () => {
  it('should accept a template to transform several fields from the source into a new single field in the target', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newname',
          withTemplate: '${firstname} ${lastname}'
        }
      ]
    }
    const source = {
      firstname: 'Firstname',
      lastname: 'Lastname'
    }
    const target = {
      newname: 'Firstname Lastname'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should resolve references to nested props correctly from within a template', () => {
    const xFormTemplate = {
      fieldset: [
        { to: 'newprop', withTemplate: '${address.town} ${address.street}' }
      ]
    }
    const source = {
      address: {
        town: 'Lüdenscheid',
        street: 'Saarlandstraße 44'
      }
    }
    const target = {
      newprop: 'Lüdenscheid Saarlandstraße 44'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should resolve references to nested props which contain non-word chars correctly from within a template', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newprop',
          withTemplate: '${$occupation.name} ${$occupation.code}'
        }
      ]
    }
    const source = {
      $occupation: {
        name: 'Automation Engineer',
        code: '019'
      }
    }
    const target = {
      newprop: 'Automation Engineer 019'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should resolve and embed the correct prop values into the string in the template', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newtext',
          withTemplate:
            'When I find ${who.me} in times of ${what.feeling} ${who.else} comes to me, ${what.does} words of wisdom, let it be'
        }
      ]
    }
    const source = {
      who: {
        me: 'myself',
        else: 'Mother Mary'
      },
      what: {
        feeling: 'trouble',
        does: 'singing'
      }
    }
    const target = {
      newtext:
        'When I find myself in times of trouble Mother Mary comes to me, singing words of wisdom, let it be'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should not fail if no props can be resolved, "undefined" will instead be placed in the template\'s placeholders', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newtext',
          withTemplate:
            'When I find ${who.me} in times of ${what.feeling} ${who.else} comes to me, ${what.does} words of wisdom, let it be'
        }
      ]
    }
    const source = {
      who: {
        prop1: 'myself',
        prop2: 'Mother Mary'
      },
      what: {
        prop3: 'trouble',
        prop4: 'singing'
      }
    }
    const target = {
      newtext:
        'When I find undefined in times of undefined undefined comes to me, undefined words of wisdom, let it be'
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })

  it('should map to a new property in case there are no template placeholders at all. Everything else will be ignored if no mapping is present.', () => {
    const xFormTemplate = {
      fieldset: [
        {
          to: 'newtext',
          withTemplate:
            "Hey Jude, don't make it bad. Take a sad song and make it better. Remember to let her into your heart. Then you can start to make it better."
        }
      ]
    }
    const source = {
      someField: 'someValue'
    }
    const target = {
      newtext:
        "Hey Jude, don't make it bad. Take a sad song and make it better. Remember to let her into your heart. Then you can start to make it better."
    }
    const newObject = mapToNewObject(source, xFormTemplate)
    expect(newObject).to.eqls(target)
  })
})
