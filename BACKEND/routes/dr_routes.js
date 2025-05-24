const express = require('express');
const router = express.Router();
const LoggedInMiddleWare = require('../MiddleWare/auth');
const { body } = require("express-validator");
const drController = require('../controllers/dr.controller');
const drModel = require('../Models/drModel');
const { searchDr } = require('../services/dr.service');
 
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be atleast 3 characters "),  
    body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),  
    body('specialization').isLength({ min: 3 }).withMessage('Specialization must be at least 3 characters'), 
    body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),   
    body('location').isLength({ min: 3 }).withMessage('Location must be at least 3 characters'),  
    body('regDate').isDate().withMessage('Invalid Date'),
  ], drController.registerDr);

router.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
     
    body('password').isLength({min:6}).withMessage("Password must be atleast 6 characters")
    

],
    drController.loginDr
)

router.get("/searchdr",LoggedInMiddleWare.isAuthorized,drController.searchDr);

router.get('/profile',LoggedInMiddleWare.isLoggedInDr,drController.drProfile);

router.get('/logout',LoggedInMiddleWare.isLoggedInDr,drController.logoutDr);

router.get('/clinic/:clinicId',drController.getDoctorByClinic);

//  clinic of dr in which dr are working
router.get("/my-clinic-dr", drController.myClinicDr)

router.get("/pending-clinic-dr", drController.pendingClinicDr)

router.get("/get-doctor",LoggedInMiddleWare.isLoggedInDr,drController.getDoctor);

 


module.exports  = router;