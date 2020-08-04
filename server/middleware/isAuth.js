const jwt = require('jsonwebtoken');

function auth() {
  return function (req, res, next) {
    const token = req.body.headers.auth;
    
    if (!token) {
      res.status(401)
        .json({ message: 'Not authenticated!' });
      return false;
    }
    
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'somesupersecret');
    } catch(error) {
      res.status(401)
        .json({ message: 'Token is invalid!' });
      return false;
    }
    
    if (!decodedToken) {
      res.status(401)
        .json({ message: 'Not authenticated!', tokenIsOutDated: true });
        return false;
    }
  }
  return true;
}

module.exports = auth;