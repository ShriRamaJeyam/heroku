const express = require('express');
const router = express.Router();
const db = require('./db');

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));

router.use(function (req, res) {
    res.end('<h1>Om Namo Naarayanaya</h1>');
});

module.exports = router;