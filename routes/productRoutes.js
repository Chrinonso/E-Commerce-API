const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');


const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/productController');


const { getSingleProductReviews } = require('../controllers/reviewController');

router.route('/').post([authenticateUser, authorizePermissions('admin')], createProduct).get(getAllProducts);

router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], uploadImage);

router.route('/:id').get(getSingleProduct).patch([authenticateUser, authorizePermissions('admin')], updateProduct).delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

// route for single product reviews.. it give us all the reviews associated with a particular product
router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
