const User = require('../models/user')
const {UnauthenticatedError} = require('../errors/index')


async function checkPermission(user, resourceUserId) {
    console.log(user);
    console.log(resourceUserId);  
    console.log(typeof resourceUserId);  
    console.log(typeof user);
    if (user.role === 'admin') return;
    let req_user = await User.findOne({email: user.email});
    if (req_user.id === resourceUserId.toString()) return;
    throw new UnauthenticatedError('lol')

}


module.exports = checkPermission;