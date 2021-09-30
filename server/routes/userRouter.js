const express = require('express');

const clientSessionController = require('./../controllers/clientSessionController');
const userController = require('./../controllers/userController');

const router = express.Router();

// Get your own user info front-end schema object
router.get('/',
  clientSessionController.verifyClientSession,
  (req, res, next) => {
    if (!res.locals.session) return res.redirect('/');

    // set user_id param to current user session's facebook_id
    req.params.user_id = res.locals.session.facebook_id;
    return next();
  },
  userController.getClientUserObject,
  (req, res) => res.json(res.locals.user)
);

router.get('/:user_id',
  userController.getClientUserObject,
  (req, res) => res.json(res.locals.user)
);

router.patch('/:user_id',
  clientSessionController.verifyClientSession,
  userController.updateUserObject,
  (req, res, next) => {
    if (res.locals.user) return res.json(res.locals.user);
    if (!res.locals.session) return res.redirect('/');
    return next({
      status: 500,
      response: { error: 'Unknown error: failed to update user with valid session.' }
    });
  }
);

module.exports = router;
