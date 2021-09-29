const User = require('./../models/User');

/**
 * Middleware: Save or update user in DB. Only runs if data exists at `res.locals.user`. This expects user session schema.
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

/**
  * Middleware: Load public user info from DB. If successful user front-end schema object will be set in `res.locals.user`.
  */
async function getClientUserObject(req, res, next) {
  const { user_id } = req.params;
  if (!user_id.match(/^[0-9]*$/)) return next({
    status: 400,
    response: { error: 'User ID must be a number.' }
  })

  const result = await User.findOne({ facebook_id: user_id });
  if (!result) return next();

  // below is front-end schema
  res.locals.user = {
    name: result.name,
    first_name: result.first_name,
    last_name: result.last_name,
    user_id: result.facebook_id,
    picture_url: result.picture_fb,
  }

  return next();
}

/**
 * Middleware: Update user info in DB. If successful user front-end schema object will be set in `res.locals.user`.
 */
async function updateUserObject(req, res, next) {
  const { user_id } = req.params;
  if (!user_id.match(/^[0-9]*$/)) return next({
    status: 400,
    response: { error: 'User ID must be a number.' }
  })

  // validate user is attempting to edit only their own profile
  if (!res.locals.session) {
    console.log('userController.updateUserObject: FAILURE: Tried to update user without valid client session.'); // STRETCH replace with server side logging 
    return next();
  }
  if (res.locals.session.facebook_id !== user_id) return next({
    status: 401,
    response: { error: 'Tried to change another user\'s profile.' }
  })

  // extract and validate requested changes

  let { name = '', first_name = '', last_name = '', email = '' } = req.body;
  name = name.trim();
  first_name = first_name.trim();
  last_name = last_name.trim();

  // names can have any word characters that are not numbers
  if (![name, first_name, last_name].some(n => n.length === 0 || n.match(/^((?!\d)\w\1)*$/i))) return next({
    status: 400,
    response: { error: 'User name must include only word characters without numbers.' }
  });
  email = email.trim();
  if (email.length > 0 && !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i)) return next({
    status: 400,
    response: { error: 'User email must be in valid format.' },
    email,
  });

  const last_login_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const updateObj = {
    ...res.locals.session,
    last_login_IP,
    last_login_time: new Date(),
  };
  if (name.length > 0) updateObj.name = name;
  if (first_name.length > 0) updateObj.first_name = first_name;
  if (last_name.length > 0) updateObj.last_name = last_name;
  if (email.length > 0) updateObj.email = email;

  try {
    const result = await User.findOneAndUpdate({ facebook_id: user_id }, updateObj, { new: true });

    // below is front-end schema
    res.locals.user = {
      name: result.name,
      first_name: result.first_name,
      last_name: result.last_name,
      user_id: result.facebook_id,
      picture_url: result.picture_fb,
    }
  } catch (err) {
    return next(err);
  }

  return next();
}

module.exports = { storeUser, getClientUserObject, updateUserObject };
