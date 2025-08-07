const delBoyService = require("../services/delBoyService");
const {validationResult, cookie} = require('express-validator');
const  deliveryBoyModel = require("../Models/DeliveryBoy");
const axios  = require('axios');
const getLocationByCoordinates  = require('../utils/getLocation');

module.exports.signUp = async(req,res)=>{
    const{firstName,lastName,email,password,phone} = req.body;
    
    try{
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            }
        const isDbAlreadyExist = await deliveryBoyModel.findOne({email});
        console.log(isDbAlreadyExist)
        if(isDbAlreadyExist){
            return res.status(500).json({message:"user already exist, please login"})
        }
        const hashedPassword = await deliveryBoyModel.hashPassword(password);
        

        const delBoy = await delBoyService.signUp({firstName,lastName,email,password:hashedPassword,phone});
    
        const delBoyToken = await delBoy.generateAuthToken();
         

        res.cookie("delBoyToken",delBoyToken);
        
        res.status(200).json({delBoyToken,delBoy});
    }catch(error){
        console.log("failed to sign up");
        return res.status(500).json({message:"Failed to signup"})

    }
}

module.exports.logIn = async(req,res)=>{
    const{email,password} = req.body;
    
    if(!email || !password){
        console.log("Data are missing at cont");
        return
    }
    try{
         
      
        const delBoy = await deliveryBoyModel.findOne({email}).select('+password');

        if(!delBoy){
             
            return res.status(401).json({message:"Email or password are incorrect"})
        }
       
        const isPasswordMatch = await delBoy.comparePassword(password);
        if(!isPasswordMatch){
            console.log("pw is ic")
            return res.status(401).json({message:"Email or password are incorrect"})
        }
         
        
        const delBoyToken = await delBoy.generateAuthToken();
        res.cookie("delBoyToken",delBoyToken);
        res.status(200).json({delBoyToken,delBoy})

    }catch(error){
        console.log("Failed to login at cont",error);
        return res.json("failed to login");
    }
}

module.exports.updateLoc = async(req,res)=>{
    const {id} = req.params;
    const{coordinates,location,isOnline} = req.body;
    
    
    try{
         
        const response = await delBoyService.updateLocation({id,coordinates,location,isOnline});
         
        return res.status(200).json(response.data)
    }catch(err){
        console.log("error updating location at cont",err);
        res.status(500).json({error:"Failed to update location"})
    }

}


// fetch location by coordinates
module.exports.getLocation = async(req,res)=>{
    try{
    const{latitude,longitude} = req.body;  
    
    const location = await getLocationByCoordinates(latitude,longitude);
    if(!location)return res.status(500).json({error:"Location not found"})

    return res.json({location})
    }catch(err){
        console.log("Error fetching location by coords at cont");
        return res.status(500).json({error:"Failed to fetch location"})

    }
}

module.exports.fetchStatus = async(req,res)=>{
    const{id} = req.params;
    
    try{
        const response = await deliveryBoyModel.findById(id);
         
        return res.status(200).json(response);
    }catch(err){
        return res.status(500).json({error:"Failed to fetch status"})
    }
}

module.exports.updateAvailStatus = async(req,res)=>{
    const {id} = req.params;
    const{isAvailable} = req.body;
    if(!id){
        return res.status(500).json({error:"All fields are required"})
    }
    try{
        const response = await delBoyService.updateAvailStatus({id,isAvailable});
        // console.log(response);
        return res.status(200).json(response);
    }catch(err){
        console.log("error updating status");
        return res.status(500).json({error:"Failed to update status"})
    }
    
}