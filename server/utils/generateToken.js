const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'devtrack_secret_key_123456', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
