const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({

    userId : { type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    userName : {type:String,required:true},
    clinicId : {type: mongoose.Schema.Types.ObjectId,ref : "Clinic",required:true},
    medicine : { type:String,required : true},
    comment: { type: String, default: 'Nothing' },
    deliveryAddress:{
        type:{
            type:String,
            enum:["manual","map","auto"],
            required:true
        },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        exactLocation: String,
        contactno: String,
         
        country: { type: String, default: "India" },
        coordinates: {  
          type: [Number], // [longitude, latitude]
          default: null
        }
    },
    clinicReply:{type:String,default:''},
    status:{type:String,enum:['Pending','Accepted','Rejected','Completed'],default:'Pending'},
     
    createdAt: { type: Date, default: Date.now },

});

const orderModel = mongoose.model('order',OrderSchema);
module.exports = orderModel;