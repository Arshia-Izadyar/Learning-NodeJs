const jwt = require('jsonwebtoken');
const {UnauthenticatedError, BadRequest} = require('../errors/');


async function authenticate(req, res, next){
    let authenticationHeaders = req.headers.authorization;
    if (!authenticationHeaders) {
        throw new UnauthenticatedError('unauthorized');
    }
    let [splitedHeader,token] = [authenticationHeaders.split(" "), authenticationHeaders.split(" ")[1]];
    if (splitedHeader.length != 2 || splitedHeader[0] !== 'Bearer'){
        throw new UnauthenticatedError('unauthorized');
    }

    try {
        const decodedToken =  jwt.verify(token, 'jwt');
        let {username, id} =  decodedToken;
        req.user = {username,id};
        return next();
         
    } catch (err) {
        throw new BadRequest('bad auth key');
    }

    
    
    

}


module.exports = authenticate;