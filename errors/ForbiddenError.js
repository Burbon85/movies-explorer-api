const http2 = require('node:http2');

const Forbidden = http2.constants.HTTP_STATUS_FORBIDDEN;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Forbidden;
  }
}

module.exports = ForbiddenError;
