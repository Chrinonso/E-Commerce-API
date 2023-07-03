const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');


const createReview = async (req, res) => {
    const {product:productId} = req.body;
    // go to the product Schema,, this is why i imported it and linked them in the Schema.
    const isValidProduct = await Product.findOne({_id:productId});

    if(!isValidProduct) {
        throw new CustomError.NotFoundError(`No project with ID ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({product: productId, user: req.user.userId,});
    
    if(alreadySubmitted) {
        throw new CustomError.BadRequestError('Already submitted review for this product')
        
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
    const review = await Review.find({}).populate({path:'product',select:'name company price',});
    res.status(StatusCodes.OK).json({ review,count:review.length });
};


const getSingleReview = async (req, res) => {
    const { id:reviewId } = req.params;
    const review = await Review.findOne({_id:reviewId});

    if(!review) {
        throw new CustomError.NotFoundError(`No review with the ID ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const {id:reviewId} = req.params;
    const { rating,title,comment } = req.body;
    const review = await Review.findOne({_id: reviewId});

    if(!review) {
        throw new CustomError.NotFoundError(`There is no review with ID ${reviewId}`);
        
    }

    checkPermissions(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
    const { id:reviewId } = req.params;
    const review = await Review.findOne({_id: reviewId});
    if(!review) {
        throw new CustomError.NotFoundError(`No review with ID ${reviewId}`);

    }
    checkPermissions(req.user, review.user);
    await review.remove()
    res.status(StatusCodes.OK).json({msg:'Review deleted'});

};

const getSingleProductReviews = async (req,res) => {
    const { id:productID }  = req.params; 
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({reviews, count:reviews.length});

};


module.exports = {
    createReview, 
    getAllReviews, 
    getSingleReview, 
    updateReview, 
    deleteReview,
    getSingleProductReviews,

};