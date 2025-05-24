const userModel = require('../Models/user_model');
const drModel = require('../Models/drModel');
const blacklistTokenModel = require('../Models/blacklistToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
 


module.exports.isLoggedInUser = async(req, res, next)=>{
    const userToken = req.cookies?.userToken || req.headers.authorization?.split(" ")[1];
 
    
    // const userToken = req.cookies ? req.cookies.userToken : null;

    if(!userToken){
        return res.status(401).json({message:"unauthorized user"});
    }
    const isBlackListed = await blacklistTokenModel.findOne({userToken});

    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }


  
    try{
        const decoded = jwt.verify(userToken,process.env.MY_SECRET);
        
        const user = await userModel.findOne({email:decoded.email});
        
       
         


        if (!user) {
            res.status(401).json("User not found");
            return;
        }
        req.user = user;
        // req.userId = user._id;
        return next();



    }catch(err){
        console.error("Error in isLoggedInUser middleware:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });

    }
}

module.exports.isLoggedInDr = async(req, res, next)=>{
    const drToken = req.cookies?.drToken || req.headers.authorization?.split(" ")[1];
    
    
    if(!drToken){
        return res.status(401).json({message: "unauthorized person"});
    }
    const isBlackListed = await blacklistTokenModel.findOne({drToken});

    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }


  
    try{
        const decoded = jwt.verify(drToken,process.env.MY_SECRET);
        const dr = await drModel.findOne({email:decoded.email});
         


        if (!dr) {
            res.status(401).json("Doctor not found");
            return;
        }
        req.dr = dr;
        return next();



    }catch(err){
        return res.status(401).json({ message: "Invalid token", error: err.message });

    }
}


module.exports.isAuthorized = async(req, res, next)=>{
    const drToken = req.cookies?.drToken || req.headers.authorization?.split(" ")[1] || req.headers.doctorauth?.split(" ")[1] ;
    const userToken = req.cookies?.userToken || req.headers.authorization?.split(" ")[2];
    
    if(!drToken && !userToken){
        return res.status(401).json({ error: 'Unauthorized user or doctor' });
    }
    if (drToken) {
        req.token = drToken;
        req.role = 'doctor';  
      } else if (userToken) {
        req.token = userToken;
        req.role = 'user';  
      }

    const isBlackListed = await blacklistTokenModel.findOne({ 
        $or: [{ drToken }, { userToken }] 
    });

    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }
    return next();


  
   
}

 