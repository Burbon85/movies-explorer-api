const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); console.log(jwt.sign);
function generateToken(payload) {
  const token = jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
// console.log(process.env);
  return token;
}

module.exports = { generateToken };
