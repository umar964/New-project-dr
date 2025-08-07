const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email : {type:String,required:true,unique:true},
    password:{type:String,required:true,select:false},
    location: { type: String, required: true }, 
    pincode:{type:Number,required:true},
    coordinates: {  
      type: { type: String, enum: ["Point"],required:true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    medicines:[{type:String}],
    rating: { type: Number, min: 1, max: 5, default: 1 },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }], // Approved doctors
    pendingDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],

    drStatus: { type: String, enum: ["Pending", "Rejected", "Issue", "Approved"], default: "Pending" },

 

    createdAt: { type: Date, default: Date.now },
  });
  
  //  this is a geospatial index for location based searches
  clinicSchema.index({ coordinates: "2dsphere" });


clinicSchema.statics.clinicHashPassword = async function(clinicPassword){
  return await bcrypt.hash(clinicPassword,10);
}

clinicSchema.methods.comparepassword = async function (password){
  return await bcrypt.compare(password,this.password);
}

clinicSchema.methods.generateAuthToken = function(){
  const clinicToken = jwt.sign({email:this.email},process.env.MY_SECRET,{expiresIn: '24h'})
  return clinicToken;
}
  
module.exports = mongoose.model('Clinic', clinicSchema);