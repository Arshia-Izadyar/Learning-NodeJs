const {CustomAPIError} = require('../errors/index');
const {isTokenValid} = require('../utils');
const {StatusCodes} = require('http-status-codes');

async function authenticateUser(req, res, next){

    const token = req.signedCookies.token;
    if (!token){
        res.status(StatusCodes.UNAUTHORIZED)
        return res.json({data:null, error: "no token provided"});
    }
    try{

        let {role, email, userId} = isTokenValid(token);
        req.user = {role:role, email:email, userId:userId}
        console.log(req.user);
        let a = isTokenValid(token)
        console.log(a);
        next();
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