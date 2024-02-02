const express = require('express'); 
const {authorizePermissions, authenticateUser} = require('../middleware/authentication');
const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');


const router = express.Router()

router.route('/').post([authenticateUser, authorizePermissions('admin')], createProduct).get(getAllProduct);
router.route('/image').post(authenticateUser, authorizePermissions('admin'), uploadImage);
router.route('/:id').patch(authenticateUser, authorizePermissions('admin'), updateProduct).delete(authenticateUser, authorizePermissions('admin'), deleteProduct).get(getSingleProduct);


module.exports = router;