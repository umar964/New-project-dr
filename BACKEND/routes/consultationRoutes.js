const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationCont');
const userModel = require('../Models/user_model');

router.post('/create-consultation', consultationController.createConsultation);

 
router.put('/update-consultation/:id', consultationController.updateConsultationStatus);

router.get('/get-consultationStatus/:id', consultationController.getConsultationStatus);



router.post('/end-consultation/:id', consultationController.endConsultation);

router.get('/pending-consultation/:doctorId', consultationController.getPendingConsultation);

router.put('/accepting-consultation/:consultationId',consultationController.acceptConsultation);

router.get('/getUserById/:userId',async(req,res)=>{
    const {userId} = req.params;
    
    const user =  await userModel.findById(userId);
    
    res.status(200).json({user})
})


module.exports = router;