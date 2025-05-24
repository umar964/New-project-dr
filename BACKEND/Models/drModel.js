const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
 
// Doctor Model
const doctorSchema = new mongoose.Schema({
  fullname : {
    firstname : {
        type :  String,
        required : true,
        minlength : [3,'First name must be atleast 3 characters'
        ]
    },
    lastname : {
        type :  String,
        
    }
},
  email: { type: String, required: true, unique: true },
  password:{type:String,required:true,select:false},

  phone: { type: String, required: true },
  specialization: { type: String, required: true },

  experience: { type: Number, default:0,min: [0, 
   'Experience cannot be negative'],},

  location: { type: String, required: true },  
  rating: { type: Number, min: 1, max: 5, default: 1 }, 

  regNo:{type:String,required:true,unique:true},
  regDate: {type: Date,required: true},

  smc: {type: String,required: true},
  createdAt: { type: Date, default: Date.now }, 
   
  approvedClinics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Clinic'}],
  pendingClinics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Clinic'}]
  
});

 
 


doctorSchema.methods.generateAuthToken = function(){
    const drToken = jwt.sign({email:this.email},process.env.MY_SECRET,{expiresIn: '24h'})
    return drToken;
}

doctorSchema.methods.comparepassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

doctorSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10);
}

 



const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;



