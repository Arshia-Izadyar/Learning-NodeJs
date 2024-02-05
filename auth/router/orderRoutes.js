const express = require('express');

const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder} = require('../controllers/orderController');



const router = express.Router();

router.route('/').post(authenticateUser, createOrder).get(authenticateUser, authorizePermissions('admin', 'user'), getAllOrders);
router.route('/my-orders').get(authenticateUser, getCurrentUserOrders);
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);



module.exports = router;