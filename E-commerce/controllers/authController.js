const {StatusCodes} = require('http-status-codes');
const User = require('../models/user');
const CustomError = require('../errors/index');
const {attachCookiesToResponse} = require('../utils/index');
const { rtrim } = require('validator');

async function register(req, res) {
    
    let {username, password, password_confirm, email} = req.body;
    if (password !== password_confirm) {
        return res.json({"data": null, "error": "passwords don't match"});
    }
    try{
 



        let email_exists = await User.findOne({email});
        if (email_exists){
            res.status(StatusCodes.CONFLICT);
            return res.json({"data":null, "err":"user with this email exists"});    
        }
        let user = await User.create({name: username, password:password, email:email})  
        res.status(StatusCodes.CREATED);

        attachCookiesToResponse(res, {role: user.role, "email": email, "userId":user._id});
        res.status(StatusCodes.OK);
        res.json({"data":"login success", "error":null});


    } catch(err){
        console.log(err)
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({"data":null, "err":err});
    }

}


async function login(req, res) {
    const {email, password} = req.body;
    
    if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST);
        

        return res.json({"data":null, "err":"please provide username ans password"});
    }
    try{

        let user = await User.findOne({email: email});
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({"data":null, "err":"wrong email or password"});
        }
     
        if (!await user.comparePassword(password)){
            res.status(StatusCodes.UNAUTHORIZED);
            

            return res.json({"data":null, "err":"wrong email or password"});
        }
        

        attachCookiesToResponse(res, {role: user.role, "email": email, "userId":user._id});
        res.status(StatusCodes.OK);
        return res.json({"data":"login success", "error":null});

    } catch(err){
        console.log(err)
    }

}


async function logout(req, res) {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(StatusCodes.NO_CONTENT);

    return res.end()
}


module.exports = {login, logout, register}
