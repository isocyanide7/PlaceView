const express=require('express');
const {check} =require('express-validator');

const router =express.Router();

const userControllers=require('../controllers/users-controllers');

router.get('/',userControllers.allUsers);

router.post('/signup',
            [
                check('name')
                .notEmpty()
                .withMessage('Empty name not allowed'),
                check('email').
                normalizeEmail().
                isEmail().
                withMessage("Invalid Email"),
                check('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 5 chars long')
                .matches(/\d/)
                .withMessage('Password must contain a number'),
            ],
            userControllers.signup);

router.post('/login',userControllers.login);

module.exports = router;