const User = require('../models/user')
const {UnauthenticatedError} = require('../errors/index')


async function checkPermission(user, resourceUserId) {
    
    if (user.role === 'admin') return;
    // let req_user = await User.findOne({email: user.email});
    console.log(user.userId === resourceUserId.toString())
    if (user.userId === resourceUserId.toString()) return;
    throw new UnauthenticatedError('lol')

}


module.exports = checkPermission;


// 65c0878547513bd22bf90763
// 65c0878547513bd22bf90763