const { expect } = require('chai');
const { describe, it } = require('mocha');

const { mapToNewObject } = require('../utils/mapping');

describe('FromEach mapping to flat object', () => {
  it("should flatten the next fromEach's fieldset if marked so", () => {
    const xFormTemplate = {
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
                  fieldset: [
                    {
                      from: 'fieldThree'
                    },
                    {
                      from: 'fieldFour'
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
    const source = {
      highLevel: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          lowLevel: [
            {
              fieldThree: 3,
              fieldFour: 4
            }
          ]
        }
      ]
    };
    const target = {
      flat: [{ fieldOne: 1, fieldTwo: 2, fieldThree: 3, fieldFour: 4 }]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it("should flatten only the next fromEach's fieldset and not more than that", () => {
    const xFormTemplate = {
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
                            from: 'this',
                            to: 'that'
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
                  this: 'value'
                }
              ]
            }
          ]
        }
      ]
    };
    const target = {
      flat: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          fieldThree: 3,
          fieldFour: 4,
          basement: [{ that: 'value' }]
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
  it('should flatten all fromEach blocks if marked so', () => {
    const xFormTemplate = {
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
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should flatten a nested object with repetition groups and keep all items of that group', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'delfi',
            flatten: true,
            fieldset: [
              {
                fromEach: {
                  field: 'cacheMorf',
                  fieldset: [
                    {
                      from: 'teflon'
                    },
                    {
                      from: 'iron'
                    },
                    {
                      from: 'obsidian'
                    },
                    {
                      from: 'lazurite'
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
    const source = {
      delfi: [
        {
          cacheMorf: [
            {
              teflon: 'Teflon',
              iron: 'Iron',
              obsidian: 'Obsidian',
              lazurite: 'Lazurite'
            },
            {
              iron: 'nori',
              obsidian: 'nobisidan'
            },
            {
              teflon: 'noflet',
              lazurite: 'terizula'
            }
          ]
        }
      ]
    };
    const target = {
      delfi: [
        {
          teflon: 'Teflon',
          iron: 'Iron',
          obsidian: 'Obsidian',
          lazurite: 'Lazurite'
        },
        {
          iron: 'nori',
          obsidian: 'nobisidan'
        },
        {
          teflon: 'noflet',
          lazurite: 'terizula'
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });

  it('should include data from all data of nested repetition groups when flattened', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'root',
            flatten: true,
            fieldset: [
              {
                fromEach: {
                  field: 'collection',
                  fieldset: [
                    {
                      from: 'fieldOne'
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
    const source = {
      root: [
        {
          collection: [
            {
              fieldOne: 1
            }
          ]
        },
        {
          collection: [
            {
              fieldOne: 2
            },
            {
              fieldOne: 3
            }
          ]
        },
        {
          collection: [
            {
              fieldOne: 4
            },
            {
              fieldOne: 5
            },
            {
              fieldOne: 6
            }
          ]
        }
      ]
    };
    const target = {
      root: [{ fieldOne: [1, 2, 3, 4, 5, 6] }]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
  it('should correctly flatten a nested fieldset without overwriting contents of the object it is flattened to', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'root',
            flatten: true,
            fieldset: [
              {
                fromEach: {
                  field: 'body',
                  flatten: true,
                  fieldset: [
                    {
                      from: 'fieldOne'
                    },
                    {
                      from: 'fieldTwo'
                    },
                    {
                      from: 'fieldThree'
                    },
                    {
                      fromEach: {
                        field: 'branch',
                        fieldset: [
                          {
                            from: 'branchFieldOne'
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
    const source = {
      root: [
        {
          body: [
            {
              fieldOne: 1,
              fieldTwo: 2,
              fieldThree: 3,
              branch: [
                {
                  branchFieldOne: 10,
                  branchFieldTwo: 22
                },
                {
                  branchFieldOne: 11
                },
                {
                  branchFieldOne: 12
                }
              ]
            }
          ]
        }
      ]
    };
    const target = {
      root: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          fieldThree: 3,
          branchFieldOne: [10, 11, 12]
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
  it('should correctly flatten a nested fieldset without overwriting contents of the object it is flattened to - case of single element collection in deepest nesting level', () => {
    const xFormTemplate = {
      fieldset: [
        {
          fromEach: {
            field: 'root',
            flatten: true,
            fieldset: [
              {
                fromEach: {
                  field: 'body',
                  flatten: true,
                  fieldset: [
                    {
                      from: 'fieldOne'
                    },
                    {
                      from: 'fieldTwo'
                    },
                    {
                      from: 'fieldThree'
                    },
                    {
                      fromEach: {
                        field: 'branch',
                        fieldset: [
                          {
                            from: 'branchFieldTwo'
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
    const source = {
      root: [
        {
          body: [
            {
              fieldOne: 1,
              fieldTwo: 2,
              fieldThree: 3,
              branch: [
                {
                  branchFieldOne: 10,
                  branchFieldTwo: 22
                },
                {
                  branchFieldOne: 11
                },
                {
                  branchFieldOne: 12
                }
              ]
            }
          ]
        }
      ]
    };
    const target = {
      root: [
        {
          fieldOne: 1,
          fieldTwo: 2,
          fieldThree: 3,
          branchFieldTwo: [22]
        }
      ]
    };
    const newObject = mapToNewObject(source, xFormTemplate);
    expect(newObject).to.eqls(target);
  });
});
