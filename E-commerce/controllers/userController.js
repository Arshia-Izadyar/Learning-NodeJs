const  {StatusCodes} = require('http-status-codes');
const {Error} = require('mongoose');



const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const User = require('../models/user');
const {attachCookiesToResponse, checkPermission} = require('../utils');
const { UnauthenticatedError } = require('../errors');

async function getAllUsers(req, res){
    const users = await User.find({'role':'user'}).select(['name','email','id']);
    return res.json({'error':null, 'data':users});
}

async function getSingleUserController(req, res){
    let id = req.params.id;
    try{

        const user = await User.findOne({_id: id});
        if (!user){
            res.status(StatusCodes.NOT_FOUND);
            return res.json({'data':null, 'error':'user not found'})
        }
        await checkPermission(req.user, user._id)
        res.status(StatusCodes.OK);
        return res.json({'error':null, 'data':user});
    } catch(err){
        if(err instanceof Error.CastError){
            res.status(StatusCodes.BAD_REQUEST);
            return res.json({'error':'wrong value for id !!!', 'data':null});
        } else if (err instanceof UnauthenticatedError){
            res.status(StatusCodes.FORBIDDEN)
            return res.json({'error':'can\'t access this resource', 'data':null});
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getSingleUser = [authenticateUser, authorizePermissions('admin', 'user'), getSingleUserController]

async function showCurrentUserController(req, res){
    return res.status(StatusCodes.OK).json({data:req.user, error:null})
}

const showCurrentUser = [authenticateUser, showCurrentUserController]

async function updateUserPasswordController(req, res){
    const {old_password, new_password} = req.body;
    let user_email = req.user.email;
   
    if (!old_password || !new_password){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error:"please provide required values"});
    }
    let user = await User.findOne({email: user_email});
    if (!await user.comparePassword(old_password)){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error:"old password is wrong"});
    }
    user.password = new_password;
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({data:"user password updated", error:null});
    
}

const updateUserPassword = [authenticateUser, updateUserPasswordController]


async function updateUserController(req, res){
    const {name, email} = req.body;
    const curr_email = req.user.email;
    let user = await User.findOne({email:curr_email});

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save()
    attachCookiesToResponse(res, {role:user.role, email:user.email});
    res.status(StatusCodes.ACCEPTED).json({data:"user updated", err:null});

}

const updateUser = [authenticateUser, updateUserController]


module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}