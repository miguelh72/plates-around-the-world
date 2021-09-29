const User = require('./../models/User');

/**
 * Middleware: Save or update user in DB. Only runs if data exists at `res.locals.user`.
 */
async function storeUser(req, res, next) {
  if (!res.locals.user) {
    console.log('userController.storeUser: FAILURE: Attempted to save user without data at res.locals.user.'); // STRETCH use server side logging 
    return next();
  }

  const last_login_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const result = await User.findOneAndUpdate(
    { facebook_id: res.locals.user.facebook_id },
    {
      ...res.locals.user,
      last_login_IP,
      last_login_time: new Date(),
    },
    { upsert: true }
  );

  if (result === null) return next({
    status: 502,
    response: { error: 'Failed to create user in database.' }
  });

  return next();
}

module.exports = { storeUser };
