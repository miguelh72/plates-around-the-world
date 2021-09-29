const jwt = require('jsonwebtoken');

const jwt_secret = require('./../assets/jwt.secret.json');

/**
 * Middleware: Setup JWT cookie to initiate client-side session.
 */
function setClientSession(req, res, next) {
  if (!res.locals.user) {
    console.error(`${req.originalUrl}: setClientSession: ERROR: Attempted to set JWT without user session info.`); // STRETCH replace with server side logging  
    return next();
  }

  jwt.sign(res.locals.user, jwt_secret.key, { expiresIn: jwt_secret.session_length }, (err, jwt_token) => {
    if (err) return next(err);

    res.cookie('jwt_token', jwt_token, { httpOnly: true, sameSite: 'lax' })
    return next();
  });
}

/**
 * Middleware: Verify client session, if valid response object will contain user session info at `res.locals.user`.
 */
function verifyClientSession(req, res, next) {
  const { jwt_token } = req.cookies;

  jwt.verify(jwt_token, jwt_secret.key, (err, jwtResult) => {
    if (err) {
      console.log(err); // STRETCH replace with server side logging  }
    } else {
      delete jwtResult.iat;
      delete jwtResult.exp;
      res.locals.user = jwtResult;
    }
    return next();
  });
}

module.exports = { setClientSession, verifyClientSession };
