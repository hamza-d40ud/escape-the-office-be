import AppError from './utils/appError.js';
import path from 'path';
import catchAsync from './utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import models from './db/models/index.js';
import logger from './utils/logger.js';
import rateLimit from 'express-rate-limit';
import { Op } from 'sequelize';
import IPCIDR from 'ip-cidr';

const verify_client_http_token = async (type) => {
    const authentication = catchAsync(async (req, res, next) => {
        let idToken = '';
        
        if (req.headers.authorization?.startsWith('Bearer'))
            idToken = req.headers.authorization.split(' ')[1];

        if (!idToken)
            return next(new AppError("You don't have permission to perform this action", 401));

        try {
            const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
            if(type === 'OTP'){
                if (tokenDetail.phone_number) {
                    req.phone_number = tokenDetail.phone_number;
                } else {
                    return next (new AppError("You don't have permission to perform this action", 401));
                }
            } else if(type === 'USER'){
                try{
                    const user = await models.users.findByPk(tokenDetail.user.id);
                    req.user = user;
                }
                catch (error) {
                    return next(new AppError("You don't have permission to perform this action", 401));
                }
            }
            return next();
        } catch (error) {
            if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
                return next(new AppError("You don't have permission to perform this action", 401));
            } else {
                return next(new AppError("Error while parsing the token", 500));
            }
        }
    });
    
    return authentication
}

const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('[REQUEST] 👈 Handling incoming request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    next();
};

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

export default {
    verify_client_http_token, 
    requestLogger,
    rateLimiter
};