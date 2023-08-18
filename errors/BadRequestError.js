const http2 = require('node:http2');

const BadRequest = http2.constants.HTTP_STATUS_BAD_REQUEST;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BadRequest;
  }
}

module.exports = BadRequestError;
