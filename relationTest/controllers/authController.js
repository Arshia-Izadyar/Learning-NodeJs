import { StatusCodes as status } from 'http-status-codes'
import { UniqueConstraintError, ValidationError, ValidationErrorItem } from 'sequelize'
import jwt from 'jsonwebtoken'

import {User, Token} from '../models/index.js'
import response from '../utils/response.js'

export async function register(req, res){
    const {username, email, password, password_confirm} = req.body
    if (password !== password_confirm) {
        return res.status(status.BAD_REQUEST).json(response(null, 'passwords dont math', false))
    }
    try {
        let user = await User.create({username: username, email: email, password: password})
        let userData = {email: user.email, username: user.username} 

        return res.status(status.CREATED).json(response(userData, null, true))
    
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            return res.status(status.CONFLICT).json(response(null, err.errors[0].message, false))
        }
        else if(err instanceof ValidationError){
            return res.status(status.BAD_REQUEST).json(response(null, err.errors[0].message, false))
        }
        return res.status(status.INTERNAL_SERVER_ERROR).json(response(null, err.errors[0].message, false))
    }
}

export async function login(req, res){
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(status.BAD_REQUEST).json(response(null, 'please provide password and username', false))
    }
    const user = await User.findOne({where: {username: username}})
    if (!user) {
        return res.status(status.NOT_FOUND).json(response(null, 'wrong username or password', false))
    }
    if (! (await user.checkPassword(password))){
        return res.status(status.NOT_FOUND).json(response(null, 'wrong username or password', false))
    }
    let userPayload = { username: user.username, userId: user.id}
    
    const tokenExists = await Token.findOne({where: {userId: user.id}})
    if (tokenExists) {
        let accessToken = jwt.sign(userPayload, 'jwt', {expiresIn: '1d'})
        let refreshToken = tokenExists.token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 72)
        })
        return res.status(status.OK).json(response({refreshToken: refreshToken, accessToken: accessToken}, null, true))
    }
    let accessToken = jwt.sign(userPayload, 'jwt', {expiresIn: '1d'})
    let refreshToken = jwt.sign(userPayload, 'jwt', {expiresIn: '3d'})
    let dbToken = await Token.create({userId: user.id, token: refreshToken})
    if (!dbToken) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(response(null, 'some thing wnt wrong', false))
    }
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 72)
    })
    return res.status(status.OK).json(response({refreshToken: refreshToken, accessToken: accessToken}, null, true))
}


export async function logout(req, res) {
    let user = req.user
    let refresh_token = req.signedCookies.refreshToken
    const token = await Token.findOne({where: {userId: user.userId}})
    if (refresh !== token.token) {
        res.cookie('refreshToken', 'logout', {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now())
        })
        return res.status(status.BAD_REQUEST).json(response(null, 'tokens not valid', true))

    }
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now())
    })
    await token.destroy()
    return res.status(status.NO_CONTENT).json(response(null, null, true))
}

export async function refresh(req, res) {
    let refresh_token = req.signedCookies.refreshToken
    if (!refresh_token) {
        return res.status(status.NOT_FOUND).json(response(null, "no refresh token found", false))

    }
    try {
        let {username, userId} = jwt.verify(refresh_token, 'jwt')
        const oldRefresh = await Token.findOne({where: {token: refresh_token}})
        if (oldRefresh){
            await oldRefresh.destroy()
        }

        let userPayload = { username: username, userId: userId}

        let accessToken = jwt.sign(userPayload, 'jwt', {expiresIn: '1d'})
        let refreshToken = jwt.sign(userPayload, 'jwt', {expiresIn: '3d'})
        
        await Token.create({userId: userId, token: refreshToken})
        return res.status(status.OK).json(response({refreshToken: refreshToken, accessToken: accessToken}, null, true))

    } catch(err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(response(null, 'some thing went wrong please login agin', true))
    }
}