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


module.exports = mongoose.model('Review', ReviewSchema);

