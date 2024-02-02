const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require('../controllers/userController');
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const express = require('express'); 


const router = express.Router();


router.route('/').get(authenticateUser, authorizePermissions('admin', 'user'), getAllUsers);


router.route('/user').get(showCurrentUser);
router.route('/update').patch(updateUser);
router.route('/change-pass').patch(updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;