const { StatusCodes } = require('http-status-codes');
const Review = require('../models/Review');
const { checkPermission } = require('../utils');
const Product = require('../models/product');


async function createReview(req, res){
    const {product: productId} = req.body;

    const isValidProduct = await Product.findOne({_id:productId});
    if (!isValidProduct){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error:"product not found"});
    }

    const alreadySubmitted = await Review.findOne({
        product: productId, user: req.user.userId
    })

    if (alreadySubmitted){
        return res.status(StatusCodes.BAD_REQUEST).json({data:null, error:"already submitted a review"});
    }


    req.body.user = req.user.userId;

    console.log(req.body)
    const review = await Review.create(req.body);

    return res.status(StatusCodes.CREATED).json({data:review, error:null});
    
}
async function getAllReviews(req, res){
    const reviews = await Review.find({}).populate('product', ['name', 'price', 'company']);
    return res.status(StatusCodes.OK).json({data:reviews, count:reviews.length ,error:null});
    
}
async function getSingleReview(req, res){
    const id = req.params.id;
    //65bd1a737b52a54f6a97c959
    const review = await Review.findOne({_id: id})
    if (!review){
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error: "review not found"})
    }
    return res.status(StatusCodes.OK).json({data:review, error: null})
}
async function updateReview(req, res){
    
    const id = req.params.id;
    let {rating, title, comment} = req.body;

    const review = await Review.findOne({_id: id})

    if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error: "review not found"})
    }

    await checkPermission(req.user, review.user._id);

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    await review.save();

    return res.status(StatusCodes.ACCEPTED).json({data:review, error: null});
}

async function deleteReview(req, res){
    const id = req.params.id;

    const review = await Review.findOne({_id:id});
    if (!review){
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error: "review not found"})
    }
    console.log('loooll');
    console.log(req.user.userId)
    console.log('here')
    await checkPermission(req.user, review.user._id);
    await review.remove()
    
    return res.status(StatusCodes.NO_CONTENT).json({data:null, error: null})
    
}



async function getSingleProductReviews(req, res){
    const {id: productId} = req.params;
    const reviews = await Review.find({product: productId});
    return res.status(StatusCodes.OK).json({data:reviews, error:null})
}

module.exports = {createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleProductReviews}