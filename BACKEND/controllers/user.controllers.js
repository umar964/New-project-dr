const userModel = require('../Models/user_model');
const userService = require('../services/user.services');
const {validationResult, cookie} = require('express-validator');
const blacklistToken = require('../Models/blacklistToken');

module.exports.registerUser  = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { fullname,email,password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    });
    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.status(201).json({token,user});
   


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

 

    
    const token = user.generateAuthToken();
    res.cookie('token',token);
     
    res.status(200).json({token,user});
}


module.exports.userProfile =  async(req,res,next)=>{
    res.status(200).json(req.user);
}

module,exports.logoutUser = async(req,res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token;
    await blacklistToken.create({token});
    res.status(200).json("Logout,Sucessfully.");


}