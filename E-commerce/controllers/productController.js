const Product = require('../models/product')
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
async function createProduct(req, res, next){
    req.body.user = req.user.userId;
    let product = await Product.create(req.body);
    return res.status(StatusCodes.CREATED).json({data: product, error: null})
    
}

async function getAllProduct(req, res){
    const products = await Product.find({});
    return res.status(StatusCodes.OK).json({data:products, error:null});
}

async function getSingleProduct(req, res){
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});
    return res.status(StatusCodes.OK).json({data:product, error:null});
}

async function updateProduct(req, res){
    const {id: productId} = req.params;
    let p = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true, runValidators: true});
    if (!p) {
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error: "product not found"});
    }
    return res.status(StatusCodes.ACCEPTED).json({data:"product updated", error: null});
}

async function deleteProduct(req, res){
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});

    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({data:null, error: "product not found"});
    }
    await product.remove();
    return res.status(StatusCodes.NO_CONTENT).json({});
}

async function uploadImage(req, res){
    
    if (!req.files) {
        throw new BadRequestError('file was not provided');
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image/jpeg')){
        throw new BadRequestError('please upload an image!');
    }
    const max_size = 1024 * 1024 * 1024;
    if (productImage.size > max_size) {
        throw new BadRequestError('please upload an smaller image (img < 1G)');
    }
    
    var filename = uuidv4();
    let splitedName = productImage.name.split('.')
    const upload_dir = path.resolve(__dirname, '../public/uploads/', `${filename}.${splitedName[splitedName.length - 1]}`)

    
    await productImage.mv(upload_dir);
    res.status(StatusCodes.CREATED).json({data:"created an image", error: null});
}

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}