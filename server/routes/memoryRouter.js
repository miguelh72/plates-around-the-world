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

router.patch('/:memory_id',
  clientSessionController.verifyClientSession,
  memoryController.updateMemory,
  (req, res) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.memory) return res.json(res.locals.memory);
    return res.sendStatus(404);
  }
);

module.exports = router;
