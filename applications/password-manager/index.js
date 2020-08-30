const express = require('express');
const router = express.Router();

router.use(function (req, res) {
    res.end('<h1>Om Namo Naarayanaya</h1>');
});

module.exports = router;