const save = {
  title: 'Save user device Details',
  description: 'Defines the structure for HTTP GET request body',
  type: 'object',
  properties: {
    client_id: {},
    client_secret: {},
    grant_type: {},
    receiptNumber: {
      type: 'string',
      description: 'Receipt Number of the user',
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      receiptNumber: 'Parameter: receiptNumber should be valid',
      client_id: 'Parameter: client id should be valid',
      client_secret: 'Parameter: client secret should be valid',
      grant_type: 'Parameter: grant type should be valid',
    },
  },
};

module.exports = save;
