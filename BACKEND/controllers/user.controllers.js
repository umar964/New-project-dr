const userModel = require('../Models/user_model');
const userService = require('../services/user.services');
const {validationResult, cookie} = require('express-validator');
const blacklistToken = require('../Models/blacklistToken');
const drModel = require('../Models/drModel');

module.exports.registerUser  = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { fullname,email,password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
       return res.status(201).json("User already exist,Please login.")
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    });
    const userToken = user.generateAuthToken();
    res.cookie("userToken", userToken);
    res.status(201).json({userToken,user});
   


}

module.exports.loginUser  = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body;
    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }

    const isPasswordMatch = await user.comparepassword(password);

    if(!isPasswordMatch){
        return res.status(401).json({message: "Invalid email or password"});
    }

 

    
    const  userToken = await user.generateAuthToken();
    res.cookie('userToken',userToken);
     
    res.status(200).json({userToken,user});
}


module.exports.userProfile =  async(req,res,next)=>{
    res.status(200).json(req.user);
}

module,exports.logoutUser = async(req,res,next)=>{
    res.clearCookie('userToken');
    const  userToken = req.cookies.userToken;
    await blacklistToken.create({userToken});
    res.status(200).json("Logout,Sucessfully.");


}

module.exports.fetchAllDoctor = async(req,res,next)=>{
    try{
        const allDoctors = await drModel.find();
        res.json(allDoctors);
        
    }catch(error){
        res.status(500).json({message:"Error fetching doctors at user controllers"});
    }
}