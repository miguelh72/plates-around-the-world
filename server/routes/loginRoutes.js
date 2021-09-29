const express = require('express');

const clientSessionController = require('./../controllers/clientSessionController');
const facebookOathController = require('./../controllers/facebookOathController');
const userController = require('./../controllers/userController');

const router = express.Router();

// https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
router.get('/facebook',
  facebookOathController.getAccessToken,
  facebookOathController.getUserInfo,
  userController.storeUser,
  clientSessionController.setClientSession,
  (req, res) => res.redirect('/login/test_jwt')
);

// TODO remove route
router.get('/test_jwt',
  clientSessionController.verifyClientSession,
  (req, res) => {
    if (res.locals.session) return res.sendStatus(200);
    return res.redirect('/');
  }
)

module.exports = router;
