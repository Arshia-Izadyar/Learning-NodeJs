const {createJWT, isTokenValid, attachCookiesToResponse} = require('./jwt');
const checkPermission = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerficationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const hashString = require('./createHash');


module.exports = {createJWT, isTokenValid, attachCookiesToResponse, checkPermission, sendVerificationEmail, sendResetPasswordEmail, hashString}