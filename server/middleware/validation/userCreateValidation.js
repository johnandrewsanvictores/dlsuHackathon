import {body, validationResult} from "express-validator";

//VALIDATE USER INFO
export const validateUserInfo = [
    body('firstName').trim().isLength({min:2}).withMessage('Name must be at least 2 characters'),
    body('lastName').trim().isLength({min:2}).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('username').trim().isLength({ min: 6}).withMessage('Username must be at least 6 characters'),
    body('password').trim().isLength({ min: 8}).withMessage('Password must be at least 8 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                error: errors.array()[0].msg,
            });
        }
        next();
    }
];