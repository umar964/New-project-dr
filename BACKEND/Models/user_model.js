const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname : {
        firstname : {
            type :  String,
            required : true,
            minlength : [3, 'First name must be atleast 3 characters'
            ]
        },
        lastname : {
            type :  String,
            
        }
    },

 

    email : {
        type : String,
        required : true,
        unique : true,
    },
 
    password: {
        type:  String,
        required : true,
        select : false
    },

    uderId : {
        type : String
    },
    
 
});


userSchema.methods.generateAuthToken = function(){
    const userToken = jwt.sign({email:this.email},process.env.MY_SECRET,{expiresIn: '24h'})
    return userToken;
}

userSchema.methods.comparepassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('user', userSchema);
module.exports  = userModel;