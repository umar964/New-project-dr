const mongoose = require("mongoose");

const orderNotificationSchema = new mongoose.Schema({
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:"order",required:true},
    clinicId:{type:mongoose.Schema.Types.ObjectId,ref:"Clinic",required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    delBoyId:{type:mongoose.Schema.Types.ObjectId,ref:"deliveryBoyModel",required:true},
    clinicName:{type:String,require:true},
    pickupLocation:{type:String,required:true},
    deliveryLocation:{type:String,required:true},
    delLocCoords: {  
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
    },
    clinicLocCoords: {  
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
    },
    delBoyCoords: {  
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
    },
    clinicToDelLocDistance:{type:Number,required:true}, //btw ye meters mai hai
    contactNumber:{type:Number,required:true},
    estimatedTimeMin:{type:Number,required:true},
    medicineTotalPrice:{type:Number,required:true},
    deliveryCharge:{type:Number,required:true},
    totalAmount:{type:Number,required:true},
    paymentMethod:{type:String,required:true},
    isSeen:{type:Boolean,default:false},
    isAccepted:{type: Boolean,default: false},
    acceptedBy:{type: mongoose.Schema.Types.ObjectId,ref: "deliveryBoyModel"},
    acceptedAt:{type: Date},
    status:{type: String,enum: ["Pending", "Accepted", "Rejected", "Ignored"],default: "Pending"},
    responseAt:{type: Date},
    createdAt:{type: Date,default: Date.now}
});

module.exports = mongoose.model('orderNotification',orderNotificationSchema);