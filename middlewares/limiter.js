const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // за 15 минут
  max: 80, // максимум 80 запросов с одного IP
});

module.exports = limiter;
