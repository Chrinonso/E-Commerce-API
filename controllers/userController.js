const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, checkPermissions } = require('../utils');
const { attachCookiesToResponse } = require('../utils');

const getAllUsers = async (req,res) => {
    
    const users = await User.find({role:'user'}).select('-password')
    // the select removes the password from the response
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async (req,res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if(!user) {
        throw new CustomError.NotFoundErrorError(`there is no user with id ${req.params.id}`)
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req,res) => {
    
    res.status(StatusCodes.OK).json({user:req.user});
};

const updateUser = async (req,res) => {
    const { name, email } = req.body;
    if(!name || !email) {
        throw new CustomError.BadRequestError('please provide a name and email');
    }

    const user = await User.findOneAndUpdate({_id:req.user.userId}, { email,name }, { new:true, runValidators: true })
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({user: tokenUser})
};

const updateUserPassword = async (req,res) => {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('please fill both values')
    }

    const user = await User.findOne({_id:req.user.userId});

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('invalid credentials');
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:'success! password updated successfully'});
};



module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};