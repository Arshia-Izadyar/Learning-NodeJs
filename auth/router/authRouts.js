const express = require('express'); 
const {login, logout, register, userVerification, forgotPassword, passwordReset} = require("../controllers/authController");


const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(authenticateUser, logout);
router.route('/verify-email').post(userVerification);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(passwordReset);


module.exports = router;