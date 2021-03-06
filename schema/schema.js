const schema = {
  type: 'object',
  properties: {
    via: {
      id: '/Via',
      type: 'object',
      properties: {
        type: { type: 'string', required: true, enum: ['date'] },
        sourceFormat: { type: 'string', required: true },
        format: { type: 'string', required: true }
      }
    },
    fieldset: {
      id: '/Fieldset',
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          withTemplate: { type: 'string' },
          toArray: { type: 'boolean' },
          via: { $ref: '/Via' },
          fromEach: {
            type: 'object',
            properties: {
              field: { type: 'string', required: true },
              to: { type: 'string' },
              flatten: { type: 'boolean' },
              fieldset: { $ref: '/Fieldset' }
            }
          }
        },
        anyOf: [
          {
            allOf: [
              {
                dependencies: {
                  withTemplate: { required: ['to'] }
                }
              }
            ],
            oneOf: [{ required: ['from'] }, { required: ['withTemplate'] }]
          },
          { required: ['fromEach'] }
        ]
      }
    }
  },
  required: ['fieldset']
};

module.exports = { schema };
