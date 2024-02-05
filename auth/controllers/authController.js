const {StatusCodes} = require('http-status-codes');
const User = require('../models/user');
const CustomError = require('../errors/index');
const {attachCookiesToResponse, sendVerificationEmail, sendResetPasswordEmail, hashString} = require('../utils/index');
const crypto = require('crypto');
const Token = require('../models/Token');


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


        const fake_token = crypto.randomBytes(40).toString('hex');
        let user = await User.create({name: username, password:password, email:email, verificationToken:fake_token})  
        // res.status(StatusCodes.CREATED);
        await sendVerificationEmail({name:user.name, email:user.email, VerificationToken:user.verificationToken, origin:'http://localhost:8000'})
        // attachCookiesToResponse(res, {role: user.role, "email": email, "userId":user._id});
        res.status(StatusCodes.OK);
        res.json({"data":"email sent", "error":null});


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
        
        if (!user.isVerified){
            res.status(StatusCodes.UNAUTHORIZED);
            return res.json({"data":null, "err":"user is not verified"});
        }
        let userPayload = {role: user.role, "email": email, "userId":user._id}
        let refresh_token = '';
        const existingToken = await Token.findOne({user: user._id});
        if (existingToken){
            let {isValid} = existingToken;
            if (isValid){

                refresh_token = existingToken.refreshToken;
                attachCookiesToResponse(res, userPayload, refresh_token);
                return res.json({"data":"login success", "error":null});
            }else{
                existingToken.remove();
            }
        }

        refreshToken = crypto.randomBytes(40).toString('hex');
        const userAgent = req.headers['user-agent'];
        const ip = req.ip;
        const userToken = {refreshToken, ip, userAgent, user:user._id}
        await Token.create(userToken)
        
        
        attachCookiesToResponse(res, userPayload, refreshToken);
        res.status(StatusCodes.OK);
        return res.json({"data":"login success", "error":null});

    } catch(err){
        console.log(err)
    }

}


async function logout(req, res) {
    await Token.findOneAndRemove({user:req.user.userId});
    res.cookie('access_token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.cookie('refresh_token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })


    res.status(StatusCodes.NO_CONTENT);

    return res.end()
}

async function userVerification(req, res){
    const {verificationToken, email} = req.body;
    if (!verificationToken || !email) {
        return res.status(StatusCodes.BAD_REQUEST).json({error:'please provide token and email'});
    }
    
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "user not found"});
    }
    console.log(user.verificationToken);
    if (user.verificationToken !== verificationToken){
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "token wrong"});
    }
    user.isVerified = true;

    user.verificationToken = '';
    user.verified = Date.now();
    user.save();
    return res.status(StatusCodes.ACCEPTED).json({data:"ok"})
}


async function forgotPassword(req, res){
    const {email} = req.body;
    if (!email){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error: "please provide email"});
    }

    const user = await User.findOne({email: email});
    if (!user) {
        res.status(StatusCodes.OK).json({data:null, error:"email sent"});
    }

    const passwordToken = crypto.randomBytes(40).toString('hex');
    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = new Date(Date.now() + (1000 * 60 * 10));
    await user.save();
    sendResetPasswordEmail({name:user.name, email:user.email, passwordToken:passwordToken, origin:"http://localhost:8000"});
    res.status(StatusCodes.OK).json({data:null, error:"email sent"});

}

async function passwordReset(req, res){
    const {token, email, password} = req.body;

    if (!token || !email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error: "please provide email/password/token"});
    }
    const user = await User.findOne({email: email});

    if (user) {
        let now = new Date();
        if (now < user.passwordTokenExpirationDate && user.passwordToken === hashString(token)){
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            user.password = password;
            await user.save()
            return res.status(StatusCodes.ACCEPTED).json({data: "ok"});
        }
    }


}


module.exports = {login, logout, register, userVerification, forgotPassword, passwordReset}
