const express=require('express');

const router =express.Router();

const userControllers=require('../controllers/users-controllers');

router.get('/',userControllers.allUsers);

router.post('/signup',userControllers.signup);

router.post('/login',userControllers.login);

module.exports = router;