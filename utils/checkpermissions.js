const CustomError = require('../errors');

const checkPermissions = async (requestUser, resourceUserId) => {
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizedError('Not Authorized to access this route');
};

module.exports = checkPermissions;



  