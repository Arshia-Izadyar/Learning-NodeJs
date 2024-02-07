import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import response from '../utils/response.js'


export default function verifyJWT(req, res, next){
    let authHeaders = req.headers.authorization
    if (!authHeaders){
        return res.json(response(res,null, 'no token provided', StatusCodes.UNAUTHORIZED, null));
    }

    let token = authHeaders.split(' ')[1]
    try {
        const {id, email} = jwt.verify(token, 'jwt')
        req.user = {userId: id, email: email};
        return next()
    }catch(err){
        if (err instanceof jwt.TokenExpiredError){
            return res.json(response(res,null, 'token expired', StatusCodes.UNAUTHORIZED, null));

        }
        if (err instanceof jwt.JsonWebTokenError){
            return res.json(response(res,null, 'token invalid', StatusCodes.UNAUTHORIZED, null));

        }
        return res.json(response(res,null, 'something wnt wrong', StatusCodes.INTERNAL_SERVER_ERROR, null));
    }


}