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
  (req, res, next) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.memory) return res.json(res.locals.memory);
    return next({
      status: 500,
      response: { error: 'Unknown error: failed to creat memory with valid session.' }
    });
  }
);

router.patch('/:memory_id',
  clientSessionController.verifyClientSession,
  memoryController.updateMemory,
  (req, res) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.memory) return res.json(res.locals.memory);
    return res.sendStatus(404);
  }
);

router.delete('/:memory_id',
  clientSessionController.verifyClientSession,
  memoryController.deleteMemory,
  (req, res, next) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.success) return res.sendStatus(200);
    return next({
      status: 500,
      response: { error: 'Unknown error: failed to delete memory with valid session.' }
    });
  }
);

module.exports = router;
