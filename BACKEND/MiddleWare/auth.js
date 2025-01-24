const userModel = require('../Models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../Models/blacklistToken');
 


module.exports.isLoggedIn = async(req, res, next)=>{
    const token = req.cookies ? req.cookies.token:null;
    if(!token){
        return res.status(401).json("unauthorized user");
    }
    const isBlackListed = await blacklistTokenModel.findOne({token});
    
    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }


  
    try{
        const decoded = jwt.verify(token,process.env.MY_SECRET);
        const user = await userModel.findOne({email:decoded.email});
         


        if (!user) {
            res.status(401).json("User not found");
            return;
        }
        req.user = user;
        return next();



    }catch(err){
        return res.status(401).json(err);

    }
}

 