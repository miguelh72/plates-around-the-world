const express = require('express');

const router = express.Router();

// TODO 
router.use('/', (req, res, next) => next({}));

module.exports = router;