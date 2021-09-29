const fetch = require('node-fetch');

const { getFacebookAccessTokenUrl, getFacebookUserInfoUrl } = require('./../utils/facebookUrls');

const facebook_oauth = require('./../assets/facebook_oauth.json');

/**
 * Middleware: When query param code is received, it has to be exchanged for an access token. If successful, `res.locals.access_token` will be a string.
 */
async function getAccessToken(req, res, next) {
  const code = req.query.code;
  //const state = JSON.parse(req.query.state); // TODO do i need state?

  res.locals.success = true;
  if (!code) {
    console.error('/facebook: Endpoint called without code query parameter.'); // STRETCH replace with server side logging  
    return next();
  }

  // ask for token from authorization server
  const body = await fetch(getFacebookAccessTokenUrl(
    process.env.BASE_URL + '/login/facebook',
    facebook_oauth.app_id,
    facebook_oauth.app_secret,
    code
  )).then(response => response.json());

  const { access_token } = body;

  if (!access_token) console.error('facebookOathController.getAccessToken: ERROR: Unable to retrieve access_token after having been provided a code.'); // STRETCH replace with server side logging  
  else res.locals.access_token = access_token;
  return next();
}

/**
 * Middleware: Gather info about the user. If successful `res.locals.user` will contain available user info.
 */
async function getUserInfo(req, res, next) {
  if (!res.locals.access_token) return next();

  const body = await fetch(getFacebookUserInfoUrl(res.locals.access_token)).then(response => response.json());

  if (!body.id) {
    return next({
      status: 400,
      response: { error: 'Unable to grab user info from Facebook.' }
    });
  }

  res.locals.user = {
    name: body.name,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    facebook_id: body.id,
    picture_fb: body.picture.data.url,
  }

  return next();
}

module.exports = { getAccessToken, getUserInfo };
