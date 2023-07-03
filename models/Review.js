const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min: 1,
        max: 5,
        required: [true, 'please provide rating'],
    },
    title:{
        type:String,
        trim: true,
        required: [true, 'please provide title'],
        maxlength: 100,
    },
    comment:{
        type:String,
        required: [true, 'please provide review text'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true,

    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref: 'Product',
        required:true,

    },
},{timestamps: true});

// this allows a user to make a review per product
ReviewSchema.index({user: 1, product: 1}, {unique: true});

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:null, averageRating:{$avg:'$rating'},
            numofReviews: {$sum: 1},
        },},
    ]);
    console.log(result)
    try {
        await this.model('Product').findOneAndUpdate({_id:productId}, {
            averageRating:Math.ceil(result[0]?.averageRating || 0),
            numOfReviews:result[0]?.numOfReviews || 0,

        })
    } catch (error) {
        console.log(error)
    }
}

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product)
});

ReviewSchema.post('remove', async function() {
    await this.constructor.calculateAverageRating(this.product)
});

module.exports = mongoose.model('Review', ReviewSchema);

