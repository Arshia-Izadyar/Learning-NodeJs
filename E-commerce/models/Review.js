const mongoose = require('mongoose');   



const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "please provide rating"]
    },
    title: {
        type: String,
        maxlength: 100,
        required: [true, "please provide title"]
    },
    comment: {
        type: String,
        required: [true, "please provide comment"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
    
},
{timestamps: true});

ReviewSchema.index({product: 1, user: 1}, {unique: true});


ReviewSchema.statics.calculateAvgRating = async function(productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {
            $group:{
                _id: null,
                averageRating: {$avg:'$rating'},
                numOfReviews:{$sum: 1},
            },
        },
    ]);
    try{
        await this.model('Product').findOneAndUpdate({_id:productId},{
            avg_rate: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        })
    } catch(err){
        console.log(err);
    }
    console.log(result);
    
}

ReviewSchema.post('save', async function(){
    await this.constructor.calculateAvgRating(this.product)
    console.log('post save called');

})



ReviewSchema.post('remove', async function(){
    this.constructor.calculateAvgRating(this.product)

    console.log('post remove called');
})



module.exports = mongoose.model('Review', ReviewSchema);