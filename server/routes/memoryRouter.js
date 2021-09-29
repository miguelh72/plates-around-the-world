const express = require('express');

const clientSessionController = require('../controllers/clientSessionController');
const memoryController = require('../controllers/memoryController');

const router = express.Router();

router.get('/:memory_id',
  memoryController.getClientMemoryObject,
  (req, res) => {
    if (res.locals.memory) return res.json(res.locals.memory);
    return res.sendStatus(404);
  }
);

router.post('/',
  clientSessionController.verifyClientSession,
  memoryController.storeMemory,
  (req, res) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.memory) return res.json(res.locals.memory);
    return res.json({ TODO: true }); // TODO 
  }
);

/*
router.put('/:memory_id',
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
*/

module.exports = router;
