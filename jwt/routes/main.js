const express = require('express');
const authenticate = require('../middleware/auth');




const router = express.Router();


const {login, dashboard} = require('../controllers/main');


router.route("/dashboard").get(authenticate, dashboard);
router.route('/login').post(login);


module.exports = router;