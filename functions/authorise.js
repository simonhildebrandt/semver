const jwt = require('jsonwebtoken');

const authorise = secret => (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({error: 'missing-token'})
  }
  try {
    req.auth = jwt.verify(token, secret);
    next();
  } catch (err) {
    console.log({err})
    return res.status(401).json({error: 'invalid-token'})
  }
}

module.exports = authorise;
