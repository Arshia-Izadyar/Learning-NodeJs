const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

function createJWT(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {'expiresIn':process.env.JWT_LIFE_TIME});
    return token;
}


function isTokenValid(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function attachCookiesToResponse(res, user) {
    const token = createJWT(user);
    res.cookie('token', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24))
    });

    // res.status(StatusCodes.OK);
    // res.json({"data":"login success", "error":null});

    
}


module.exports = {isTokenValid, createJWT, attachCookiesToResponse}