const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};


// for admin app

exports.isAuthenticatedUserAndContinueRequest = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        req.user = null;
    } else {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
    }

    next();
});

exports.authorizeRolesAndContinueRequest = (...roles) => {
    return (req, res, next) => {
        // if user is available check for roles
        if (req.user !== null) {

            if (!roles.includes(req.user.role)) {
                return next(
                    new ErrorHander(
                        `Role: ${req.user.role} is not allowed to access this resouce `,
                        403
                    )
                );
            }
        }

        next();
    };
};