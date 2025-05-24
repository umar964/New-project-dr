const mongoose = require('mongoose');


const deliverySchema = new mongoose.Schema({
    orderId : {type: mongoose.Schema.Types.ObjectId,ref:'order',required:true},
    delBoyId:{type:String},
    currentLocation:{
        lat:Number,
        lon:Number,
    },
    startTime:Date,
    endTime:Date,
    isDelivered:{type:Boolean,default:false},
    otp:String,

});


module.exports = mongoose.model('orderDelivery',deliverySchema);
