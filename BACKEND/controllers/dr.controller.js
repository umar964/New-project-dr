const drModel = require('../Models/drModel');
const drService = require('../services/dr.service');
const {validationResult} = require('express-validator');
const blacklistToken = require('../Models/blacklistToken');

module.exports.registerDr  = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullname,email,password,phone,specialization,experience,regNo,regDate,smc,location,createdAt} = req.body;

    



    const isDrAlreadyExist = await drModel.findOne({email});
    if(isDrAlreadyExist){
        return res.status(201).json("Already exist,Please login.")
    }
    const hashedPassword = await drModel.hashPassword(password);

    const dr = await drService.createDr({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        phone,specialization,experience,location,regNo,regDate,smc,createdAt
    });
    const drToken = dr.generateAuthToken();
    res.cookie('drToken', drToken, { secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

     

    res.status(201).json({drToken,dr});
     
   


}

module.exports.loginDr = async(req,res,next)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        res.status(201).json({errors:error.array()})
    }

    const {email,password} = req.body;

    const dr = await drModel.findOne({email}).select('+password');

    if(!dr){
        return res.status(201).json('Invalid Email or Password');
    }

    const isPasswordMatch = await dr.comparepassword(password);

    if(!isPasswordMatch){
        return res.status(201).json('Invalid Email or Password');
    }

    const drToken = await dr.generateAuthToken();
    res.cookie('drToken', drToken, { secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    

    res.status(200).json({drToken,dr});

}

module.exports.drProfile =  async(req,res,next)=>{
    res.status(200).json(req.dr);
}

module.exports.logoutDr = async(req,res,next)=>{
    res.clearCookie('drToken');
    const  drToken = req.cookies.drToken;
    await blacklistToken.create({drToken});
    res.status(200).json("Logout,Sucessfully.");


}


module.exports.getDoctorByClinic = async(req,res,next)=>{
    const {clinicId} = req.params;
    if(!clinicId){
        console.log(" clinic id not found at dr cont")
    }
    try{
        const doctors = await drService.getDoctorByClinic(clinicId);
        res.status(400).json(doctors);
    }catch(error){
        console.log("problem at dr con")
        res.status(500).json({ error: error.message });
    }
}

module.exports.getDoctor = async(req,res,next)=>{
    const { drId } = req.query;
   
    if(!drId){
        return res.status(200).json({message:"drId is missing"});
    }
    try{
        const dr = await drService.getDoctor(drId);
       
        res.json(dr);
    }catch(error){
        console.log("Error fetching dr at cont")
        res.status(500).json({ error: error.message });
    }
}

module.exports.myClinicDr = async(req,res)=>{
    const { drId } = req.query;
    try{
        
        const myClinicDr = await drService.myClinicDr(drId);
        res.json(myClinicDr);
    }catch(error){
        console.log("error fetchin clinic of dr");
        res.json({message:"Error fetching clinic of dr at cont"})
        throw new Error("Error fetching clinic of dr at cont")
    }
}

module.exports.pendingClinicDr = async(req,res)=>{
    const { drId } = req.query;
    try{
        
        const pendingClinicDr = await drService.pendingClinicDr(drId);
        res.json(pendingClinicDr);
    }catch(error){
        console.log("error fetchin clinic of dr");
        res.json({message:"Error fetching clinic "})
        throw new Error("Error fetching clinic  ")
    }
}

module.exports.searchDr = async(req,res)=>{
    const{ drName } = req.query;
    
      if(!drName){
            console.log("Dr name is required");
            return res.status(400).json({ message: "Doctor name is required  " });
        }
        try{
            const doctors = await drService.searchdr(drName);
            return res.status(200).json(doctors);
        }catch(error){
            console.error("Error fetching doctors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
}



 