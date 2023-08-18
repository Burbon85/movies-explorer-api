const http2 = require('node:http2');

const NotFound = http2.constants.HTTP_STATUS_NOT_FOUND;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NotFound;
  }
}

module.exports = NotFoundError;
