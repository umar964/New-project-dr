const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const LoggedInMiddleWare = require('../MiddleWare/auth');

 
router.post('/book',LoggedInMiddleWare.isLoggedInUser, appointmentController.bookAppointment);
router.put('/updatedAppointment/:appId',LoggedInMiddleWare.isLoggedInDr,appointmentController.updatedAppointment);

 
router.get('/userAppointments',LoggedInMiddleWare.isLoggedInUser,appointmentController.getUserAppointments);

 
router.get('/doctorAppointments',LoggedInMiddleWare.isLoggedInDr, appointmentController.getDoctorAppointments);

module.exports = router;