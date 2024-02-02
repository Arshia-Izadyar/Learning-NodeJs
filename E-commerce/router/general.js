const express = require('express');


const router = express.Router();

router.route('/').get((req, res) => res.json({"status": "OK"}));


module.exports = router;