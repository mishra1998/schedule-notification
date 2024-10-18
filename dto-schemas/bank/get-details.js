const getDetails = {
  title: 'get single bank detail of user',
  description: 'Defines the structure for HTTP GET request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'publicId',
      format: 'uuid',
    },
  },
  required: [ 'publicId' ],
  additionalProperties: false,
};

module.exports = getDetails;
