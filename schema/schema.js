const schema = {
  type: 'object',
  properties: {
    fieldset: {
      id: '/Fieldset',
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          from: { type: 'string'},
          to: { type: 'string' },
          fromEach: {
            type: 'object',
            properties: {
              field: { type: 'string', required: true },
              to: { type: 'string' },
              fieldset: { $ref: '/Fieldset' }
            }
          }
        },
        anyOf: [{ required: ['from'] }, { required: ['fromEach'] }]
      }
    }
  },
  required: ['fieldset']
};

module.exports = { schema };
