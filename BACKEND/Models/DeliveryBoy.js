const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const deliveryBoySchema = new mongoose.Schema({
    firstName:{type:String,required : true,
        minlength : [3,'First name must be atleast 3 characters'
        ]},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,select:false},
    phone:{type:String,required:true},
    isOnline:{type:Boolean,default:false},
    isAvailable:{type:Boolean,default:false},
    location:{type:String,required:false},
    coordinates: {  
      type: { type: String, enum: ["Point"],default:"Point" },
      coordinates: { type: [Number], default:undefined }, // [longitude, latitude]
    },


});

deliveryBoySchema.methods.generateAuthToken = function(){
    const delBoyToken = jwt.sign({email:this.email},process.env.MY_SECRET,{expiresIn: '48h'})
    return delBoyToken;
}

deliveryBoySchema.methods.comparePassword = async function(password){
    
    return await bcrypt.compare(password,this.password); 
}

deliveryBoySchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

module.exports = mongoose.model("deliveryBoyModel",deliveryBoySchema);