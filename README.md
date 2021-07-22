#### [json-xform](https://www.npmjs.com/package/@perpk/json-xform)
# JSON transform 🤖

## Overview
A library to transform a JSON structure to another one by using an intermediate JSON DSL.
It shall facilitate cases where an application (or an API) needs to process several JSON files
generated by other software clients and to transform it to an internal, common format for further processing.

An example for such a case would be an application which takes reports, perhaps from testing tools and generates tickets or tasks (in Jira for instance).
In order to avoid coding each time when a new tool shall be integrated, the user can provide a mapping by implementing the appropriate DSL alongside with the 
JSON report to process.

## The DSL
The DSL is implemented in JSON. Its vocabulary is limited to five words.
1. fieldset - defines an array of objects, each object encapsulates 
2. from - defines the field to get the value from the source JSON.
3. to - defines the field to write the value to the target JSON.
4. fromEach - defines an object which addresses an array in the source JSON and provides the possibility to pick particular source fields to write to the target JSON by using the fieldset again.
5. field - defines the field in the fromEach block to get the value from.

## Dependencies
The essential libraries used by this project are [jsonpath](https://www.npmjs.com/package/jsonpath) and [jsonschema](https://www.npmjs.com/package/jsonschema)

## How it works
There are 2 functions exposed which accept two JSON objects. One JSON object contains the mapping while the other one contains the source object.

`mapToNewObject` - Accepts JSON obects.

`mapWithTemplate` - Accepts JSON files.

Both functions return the transform JSON object.

## Mapping
Let's say you have a JSON file which looks something like the following:

```javascript
    const source = {
      highLevel: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          lowLevel: [
            {
              fieldThree: 3,
              fieldFour: 4,
              basement: [
                {
                  this: {
                    thing: {
                      there: 'here I am'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    };
```

And for some reason (only you can know) you'd like to have something like this instead:
```javascript
    const target = {
      flat: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          fieldThree: 3,
          fieldFour: 4,
          that: {
            here: 'here I am'
          }
        }
      ]
    };
```

You can do so by providing this mapping:
```javascript
const mapping = {
      fieldset: [
        {
          fromEach: {
            field: 'highLevel',
            to: 'flat',
            flatten: true,
            fieldset: [
              {
                from: 'fieldOne'
              },
              {
                from: 'fieldTwo'
              },
              {
                fromEach: {
                  field: 'lowLevel',
                  flatten: true,
                  fieldset: [
                    {
                      from: 'fieldThree'
                    },
                    {
                      from: 'fieldFour'
                    },
                    {
                      fromEach: {
                        field: 'basement',
                        fieldset: [
                          {
                            from: 'this.thing.there',
                            to: 'that.here'
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
```

Woah! easy there, pilgrim! Let's break it down actually and take it from top to bottom...

1. It all **must start** with a `fieldset` (_array_). It's a wrapper property which contains further mapping declarations.

2. Then there's a `fromEach` (_object_) property following which represents a wrapper for arrays of objects.

3. The `fromEach` property **must** include at least a `field` (_string_) property, which declares the property in the source JSON object for get the value from. It always refers to an array type since it only may appear in the context of a `fromEach` block.

4. The `to` (_string_) propery may be found in a `fromEach` block, as well as in a `fieldset`. It defines the field in the target object where the value shall be writte to. It isn't mandatory though, in case it's missing the field in the target object will have the same name as it's source counterpart.

5. The `flatten`(_boolean_) property is optional. It can be used in case the array the `fromEach` refers to shall be extracted from the array. That means that the properties of any objects are extracted and placed one level above. The `flatten` property is only valid within the scope of a single `fromEach`. That means other, nested `fromEach` blocks aren't affected. If such nested blocks must be "flattened" as well, the `flatten` property may be set to `true` again in their own context. The default for the "flattening" is `false`.

6. Then, there's `fieldset` again. Here the `fieldset` contains a precise mapping declaration for particular fields. 

7. The `from` property denotes the key in the source object where the value shall be taken from. We can use chaining via dot (.) to cherry pick values out from nested object structures.

8. The `to` property is the key in the target object where the value shall be written to. It is **not mandatory** - in case it's not there, the default applies, which means that the 'write-to' property in the target will be the same as the 'from' from the source. Chaining can be applied here as well. It'll create a nested object structure with the last property to be the carrier of the value.

That's a rather complex yet complete example since it makes use of the whole range of the currently implemented vocabulary of the DSL.

