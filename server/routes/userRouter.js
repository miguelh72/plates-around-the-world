const express = require('express');

const clientSessionController = require('./../controllers/clientSessionController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.get('/:user_id',
  userController.getClientUserObject,
  (req, res) => res.json(res.locals.user)
);

router.put('/:user_id',
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
