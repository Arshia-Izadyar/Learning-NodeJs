const {CustomAPIError} = require('../errors/index');
const Token = require('../models/Token');
const {isTokenValid, attachCookiesToResponse} = require('../utils');
const {StatusCodes} = require('http-status-codes');

async function authenticateUser1(req, res, next){

    const token = req.signedCookies.access_token;
    if (!token){
        res.status(StatusCodes.UNAUTHORIZED)
        return res.json({data:null, error: "no token provided"});
    }
    try{
        
        let {user} = isTokenValid(token);
   
        req.user = {role:user.role, email:user.email, userId:user.userId}
      
        next();
    } catch(err){
        res.status(StatusCodes.UNAUTHORIZED)
        return res.json({data:null, error: err});
    }
}


async function authenticateUser(req, res, next){

    const {access_token, refresh_token} = req.signedCookies;
    console.log("refresh=>>>>>",refresh_token);
    // if (!access_token){
    //     res.status(StatusCodes.UNAUTHORIZED)
    //     return res.json({data:null, error: "no token provided"});
    // }
    try{
        if (access_token){

            let {user} = isTokenValid(token);
            
            req.user = {role:user.role, email:user.email, userId:user.userId}
            
            return next();
        }
        const payload = isTokenValid(refresh_token);
        console.log(payload);
        const existingToken = await Token.findOne({user: payload.user.userId, refreshToken:payload.refreshToken});
        if (!existingToken || !existingToken?.isValid){
            res.status(StatusCodes.UNAUTHORIZED)
            return res.json({data:null, error: "wrong token provided"});
        }
        attachCookiesToResponse(res, payload.user, existingToken.refreshToken);
        req.user = payload.user;
        return next();


    } catch(err){
        res.status(StatusCodes.UNAUTHORIZED)
        return res.json({data:null, error: err});
    }
}



function authorizePermissions(...roles){

    return (req, res, next)=> {
        if (!roles.includes(req.user.role)){
            console.log(req.user.role);
            console.log(roles.includes(req.user.role));
            res.status(StatusCodes.FORBIDDEN);
            return res.json({data:null, error: "you dont have permission to access this route"});
        }
        next();
    }

}




module.exports = {authenticateUser, authorizePermissions};