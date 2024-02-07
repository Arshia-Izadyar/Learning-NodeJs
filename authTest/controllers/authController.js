import {StatusCodes} from 'http-status-codes'

import {TokenModel as Token, UserModel as User} from '../models/index.js'
import response from '../utils/response.js'
import { Sequelize, where } from 'sequelize';
import jwt from 'jsonwebtoken';
import userPayload from '../utils/userPayload.js'


export async function signup(req, res){
    const {email, first_name, last_name, password, password_confirm} = req.body;
    if (password !== password_confirm) {
        return res.json(response(res, null, 'passwords dont match', StatusCodes.BAD_REQUEST, null));
    }
    
    try {
        const user = await User.create({email: email, first_name: first_name, last_name: last_name, password: password});
        let userData = {email: user.email, first_name: user.first_name, last_name: user.last_name} 
        return res.json(response(res, userData, null, StatusCodes.CREATED, null));

    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError' ){
            return res.json(response(res, null, 'email already exists', StatusCodes.CONFLICT, null));
        } else if (err.name === 'SequelizeValidationError') {
            return res.json(response(res, null, `null value entered`, StatusCodes.BAD_REQUEST, null));
        }
        return res.json(response(res, null, `someThing went wrong`, StatusCodes.INTERNAL_SERVER_ERROR, null));
    }
}


export async function login(req, res){
    const {email, password} = req.body;
    if (!email || !password) {
        return res.json(response(res, null, 'please provide email and password', StatusCodes.BAD_REQUEST, null));
    }
    try {
        const user = await User.findOne({where: {email: email}});
        if (!user){
            return res.json(response(res, null, 'user not found', StatusCodes.NOT_FOUND, null));
        }
        console.log(await user.isValidPassword(password))
        if (!(await user.isValidPassword(password))){
            return res.json(response(res, null, 'wrong password', StatusCodes.NOT_FOUND, null));
        }

        let userToken = await Token.findOne({where:{userId: user.id}});
        if (userToken){
            try{
                jwt.verify(userToken.token, 'jwt')
                let accessToken = jwt.sign(userPayload(user), 'jwt', {expiresIn: '1d'});
                let refreshToken = userToken.token
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    signed: true,
                    maxAge: 1000 * 60 * 60 * 24
                })
                return res.json(response(res, {accessToken: accessToken, refreshToken: refreshToken}, null, StatusCodes.ACCEPTED, null));
            } catch(err){
                await userToken.destroy() 
            } 
        }
        let accessToken = jwt.sign(userPayload(user), 'jwt', {expiresIn: '1d'});
        let refreshToken = jwt.sign(userPayload(user), 'jwt', {expiresIn: '3d'});
        console.log(refreshToken)

        let rToken = await Token.create({token: refreshToken, userId:user.id});
        if (!rToken){
            return res.json(response(res, null, `someThing went wrong`, StatusCodes.INTERNAL_SERVER_ERROR, null));
        }
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24
        })
        return res.json(response(res, {accessToken: accessToken, refreshToken: refreshToken}, null, StatusCodes.ACCEPTED, null));

    } catch (err) {
        console.log(err)
        return res.json(response(res, null, `someThing went wrong`, StatusCodes.INTERNAL_SERVER_ERROR, null));

        
    }
}


export async function logout(req, res){
    const user = req.user
    let token = await Token.findOne({where: {userId: user.userId}});
    let cookieToken = req.signedCookies.refreshToken
    if (!token && !cookieToken){
        return res.json(response(res, 'successful logout', null, StatusCodes.OK, null));
        
    }
    if (token.token === cookieToken){
        token.destroy();
        res.cookie('refreshToken', 'logout', {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now())
        })
    }
    return res.json(response(res, 'successful logout', null, StatusCodes.OK, null));
}


export async function refresh(req, res) {
    let refresh_token = req.signedCookies.refreshToken;
    if (!refresh_token) {
        return res.json(response(res, null, 'no refresh token found in cookie', StatusCodes.UNAUTHORIZED, null))
    }
    let token = await Token.findOne({where: {token: refresh_token}});
    if (!token){
        return res.json(response(res, null, 'no refresh token found', StatusCodes.UNAUTHORIZED, null))
    }

    try {
        const {id, email} = jwt.verify(token.token, 'jwt')
        const user = await User.findOne({where: {id: id}});
        let accessToken = jwt.sign(userPayload(user), 'jwt', {expiresIn: '1s'});
        let refreshToken = jwt.sign(userPayload(user), 'jwt', {expiresIn: '3d'});
        await token.destroy()
        await Token.create({token: refreshToken, userId: user.id});

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            signed: true,
            maxAge: (1000 * 60 * 60 * 24)
        })
        return res.json(response(res, {accessToken: accessToken, refreshToken: refreshToken}, null, StatusCodes.ACCEPTED, null));

    } catch (err) {
        console.log(err)
        return res.json(response(res, null, 'no refresh token found', StatusCodes.UNAUTHORIZED, null))
    }
}