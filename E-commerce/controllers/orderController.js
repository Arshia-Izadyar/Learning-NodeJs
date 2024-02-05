const {StatusCodes} = require('http-status-codes');
const Order = require('../models/Order');
const Product = require('../models/product');
const { checkPermission } = require('../utils');

async function fakeStripe({amount, currency}) {
    const client_secret = '284#$DF@#$#fsj'
    return {client_secret, amount}
}

async function createOrder(req, res){
    const {items: cartItems, tax, shippingFee} = req.body;
    if (!cartItems || cartItems.length < 1){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error: "no items provided"});
    }   
    if (!tax || !shippingFee){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error: "no tax or shippingFee provided"});
    } 

    let orderItems = [];
    let subTotal = 0;

    for (const item of cartItems) {

        const dbProduct = await Product.findOne({_id: item.product});
        if (!dbProduct){
            return res.status(StatusCodes.NOT_FOUND).json({data:null, error: `item '${item.name}' doesn't exist`});
        }
        const {name, price, image, _id} = dbProduct;
        const singleOrder = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        };
        orderItems.push(singleOrder);
        console.log('hwewe1');
        subTotal += item.amount * price;
        console.log('hwewe2');
    
    }
    const total = tax + shippingFee + subTotal;
    
    const paymentIntent = await fakeStripe({amount: total, currency:'rial'});
    
    const order = await Order.create({cartItems:orderItems, total, subtotal:subTotal, tax, shipping:shippingFee, clientSecret:paymentIntent.client_secret, user: req.user.userId})
    console.log('qwe[k 33');
    
    res.status(StatusCodes.CREATED).json({data:order, clientSecret: paymentIntent.client_secret});

    console.log(orderItems);
    console.log(subTotal);

    return res.status(StatusCodes.CREATED).json({data: null, error: null});

}

async function getAllOrders(req, res){

    const orders = await Order.find()
    return res.status(StatusCodes.OK).json({data:orders, error:null});
}


async function getSingleOrder(req, res){
    const id = req.params.id;
    const order = await Order.findOne({_id:id});
    if (!order){
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error:'the requested order not found'});
    }

    return res.status(StatusCodes.OK).json({data:order});

}


async function getCurrentUserOrders(req, res){
    const userId = req.user.userId;

    const userOrders = await Order.find({user: userId});
    return res.status(StatusCodes.OK).json({data: userOrders});
}




async function updateOrder(req, res){
    const orderId = req.params.id;
    const order = await Order.findOne({_id:orderId});
    const {paymentIntentId} = req.body;
    
    if (!order){
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error:'the requested order not found'});
    }
    await checkPermission(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    return res.status(StatusCodes.ACCEPTED).json({data:order});

}





module.exports = {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder}