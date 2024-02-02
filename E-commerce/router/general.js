const express = require('express');


const router = express.Router();

router.route('/').get((req, res) => {
    res.json({"status": "OK"})
    console.log(req.signedCookies)
});


module.exports = router;