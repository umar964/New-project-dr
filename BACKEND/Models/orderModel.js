const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({

    userId : { type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    userName : {type:String,required:true},
    clinicId : {type: mongoose.Schema.Types.ObjectId,ref : "Clinic",required:true},
    medicine : { type:String,required : true},
    comment: { type: String, default: 'Nothing' },
    contactNo:{type:Number,required:true},
    deliveryAddressCoords: {  
      type: { type: String, enum: ["Point"],default:"Point" },
      coordinates: { type: [Number], default:undefined }, // [longitude, latitude]
    },
    clinicReply:{type:String,default:''},
    status:{type:String,enum:['Pending','Accepted','Rejected','Ready','Received','Delivered'],default:'Pending'},
    billText:{type:String,default:''},
    billReceipt:{data:Buffer,contentType:{type:String,default:''}},
    medicineTotalPrice:{type:String,default:''},
    paymentMethod:{type:String,required:true,default:'COD'},
    createdAt: { type: Date, default: Date.now },

});

const orderModel = mongoose.model('order',OrderSchema);
module.exports = orderModel;