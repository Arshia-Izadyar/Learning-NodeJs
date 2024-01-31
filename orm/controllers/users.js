import passport from "passport";
import { User } from "../models/index.js";
import jwt from 'jsonwebtoken';
import {StatusCodes} from 'http-status-codes';


export async function userCreate({fullName, username, password}){
    return await User.create({
        fullName,
        username,
        password,
    });

}

export async function getUser({username}) {
    return await User.findOne({where: {username: username} });

}


async function signupController(req, res) {
    res.status(201);
    res.json({"success":"true", "data":req.user});
}

export const signup = [passport.authenticate('signup', {session: false}), signupController]


async function loginController(req, res){
    // console.log(req.user.username);

    if (!req.user){
        res.status(StatusCodes.UNAUTHORIZED);
        return res.json({"data":"null", "status":"failed"});

    }

    const token = generateToken(req);
    return res.json({"token":token});

}


export const login =  [passport.authenticate('login', {session: false}), loginController]

function generateToken(req) {
    const payload = { username: req.user.username, id: req.user.id };

    const token = jwt.sign(payload, 'jwt', { expiresIn: '2d' });
    return token;
}
