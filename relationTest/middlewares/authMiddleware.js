import { StatusCodes } from "http-status-codes"
import generateResponse from "../utils/response.js"
import jwt from 'jsonwebtoken'

export default function authenticate(req, res, next){
    let authHeaders = req.headers.authorization
    if (!authHeaders) {
        return res.status(StatusCodes.UNAUTHORIZED).json(generateResponse(null, 'no token provided', false))

    }
    let token = authHeaders.split(" ")[1]
    if (authHeaders.split(" ").length !== 2){ 

        return res.status(StatusCodes.UNAUTHORIZED).json(generateResponse(null, 'invalid token provided', false))
    }
    try {
        let {username, userId} = jwt.verify(token, 'jwt')
        let user = {username: username, userId: userId}
        req.user = user
        next()


    } catch(err) {
        console.log(err);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json(generateResponse(null, 'token provided is expired', false))
        }
        else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.UNAUTHORIZED).json(generateResponse(null, 'token provided is not a access token', false))
        }
    }
}