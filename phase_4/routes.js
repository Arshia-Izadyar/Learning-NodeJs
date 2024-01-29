const express = require('express'); 


const router = express.Router();
const home = require( './controller');


router.route("/contacts").get(home);

module.exports = home;