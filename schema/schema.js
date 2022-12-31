const schema = {
  type: 'object',
  properties: {
    via: {
      id: '/Via',
      type: 'object',
      properties: {
        type: { type: 'string', required: true, enum: ['date', 'custom'] },
        sourceFormat: { type: 'string' },
        format: { type: 'string', required: true }
      },
      anyOf: [
        {
          properties: {
            type: { const: 'date' }
          },
          required: ['sourceFormat']
        },
        {
          properties: {
            type: { not: { const: 'date' } }
          }
        }
      ]
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
          valueToKey: { type: 'boolean' },
          withValueFrom: { type: 'string' },
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
                  withTemplate: { oneOf: [{ required: ['to'] }, { required: ['withValueFrom'] }] }
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
}

module.exports = { schema }
