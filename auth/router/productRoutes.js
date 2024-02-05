const express = require('express'); 
const {authorizePermissions, authenticateUser} = require('../middleware/authentication');
const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewcontroller');

const router = express.Router()

router.route('/').post([authenticateUser, authorizePermissions('admin', 'user')], createProduct).get(getAllProduct);
router.route('/image').post(authenticateUser, authorizePermissions('admin'), uploadImage);
router.route('/:id').patch(authenticateUser, authorizePermissions('admin'), updateProduct).delete(authenticateUser, authorizePermissions('admin', 'user'), deleteProduct).get(getSingleProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;