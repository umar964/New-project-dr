const express = require('express');
const router = express.Router();

const clinicController = require('../controllers/clinicController');
const LoggedInMiddleWare = require('../MiddleWare/auth');

const {createClinic} = require('../services/clinicService');
const clinicModel = require('../Models/clinicModel')

// this is for search clinic by longitude,latitude and radius in clinic near me
router.get('/searchClinic',LoggedInMiddleWare.isAuthorized,clinicController.searchClinics);

router.post('/createclinic',async(req,res)=>{
     const {name,email,password,location,pincode,coordinates} = req.body;
 
 try{
    if(!name || !email || !password || !location || !pincode|| !coordinates  || !coordinates.coordinates){

         

        return res.status(400).json({ error: 'Missing required fields' });
    }
    const [longitude, latitude] = coordinates.coordinates;
    const clinic = await createClinic(name,email,password,location,pincode,[longitude, latitude]);
    res.status(201).json(clinic);
 }catch(error){
    console.error(error);
    res.status(500).json({ error: error.message });
 }
});

router.post('/login-clinic',clinicController.loginClinic)
 
router.get("/clinic-details/:id",clinicController.clinicDetails)

router.get('/clinic-logout',clinicController.clinicLogout)
 
// all clinic for ordering medicine
router.get("/fetchClinic",clinicController.fetchClinic);

router.get("/search-clinic-byName",clinicController.searchClinicByName);

router.get("/pendingDr/:clinicId",clinicController.fetchPendingDr);

router.put("/update-dr-status",clinicController.updateDrStatus);

router.post("/add-doctor/:clinicId",LoggedInMiddleWare.isLoggedInDr,clinicController.addDoctor);

module.exports = router;