const express = require('express');
const router = express.Router();
const LoggedInMiddleWare = require('../MiddleWare/auth');
const { body } = require("express-validator");
const userController = require('../controllers/user.controllers');
const drModel = require('../Models/drModel');
 

router.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be atleast 3 characters "),
    body('password').isLength({min:6}).withMessage("Password must be atleast 6 characters")
],
    userController.registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
     
    body('password').isLength({min:6}).withMessage("Password must be atleast 6 characters")
],
    userController.loginUser
)

router.get('/profile',LoggedInMiddleWare.isLoggedInUser,userController.userProfile);

router.get('/logout',LoggedInMiddleWare.isLoggedInUser,userController.logoutUser);

router.get("/alldoctors",userController.fetchAllDoctor);


module.exports  = router;