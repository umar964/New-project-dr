const orderModel = require('../Models/orderModel');
const OrderNotificationModel = require('../Models/OrderNotificationModel');
const orderService = require('../services/orderServices');
const { clinicDetails } = require('./clinicController');
const {generateOtp} = require("../utils/generateOtp")
const otpModel = require('../Models/otpModel')
 
 

module.exports.addOrder = async(req,res)=>{
    try{
         
        const {userId,userName,comment,clinicId,medicine,contactNo,deliveryAddressCoords} = req.body;
     
        const order = await orderService.addOrder(userId,comment,userName,clinicId,medicine,contactNo,deliveryAddressCoords);
        

        res.status(200).json(order);

    }catch(error){

        console.log("Error adding order at order cont",error);
        res.status(500).json({error:"Error adding order at  order cont"})

    }
}

module.exports.fetchOrder = async(req,res)=>{
    try{
        const  {clinicId} = req.params;
        
        if(!clinicId){
            console.log("clinicId is missing")
        }
        const orders = await orderService.fetchOrder(clinicId);
        // console.log(orders)
        
        res.status(200).json(orders);
    }catch(error){
        console.log("error fetching orders",error)
        throw error;
    }

}

module.exports.fetchOrderByUserId = async(req,res)=>{
    try{
        const  {userId} = req.params;
        
        if(!userId){
            console.log("userId is missing")
        }
        const orders = await orderService.fetchOrderByUserId(userId);
        res.status(200).json(orders);
    }catch(error){
        console.log("error fetching orders",error)
        throw error;
    }

}

module.exports.fetchOrderByOrderId = async(req,res)=>{
    try{
        const  {orderId} = req.params;
        
        if(!orderId){
            console.log("orderId is missing")
            return
        }
        const order = await orderService.fetchOrderByOrderId(orderId);
        res.status(200).json(order);
    }catch(error){
        console.log("error fetching orders",error)
        throw error;
    }

}

module.exports.updateOrderStatus = async(req,res)=>{
    try{
        const {orderId} = req.params;
        const {newStatus} = req.body;
        
        if(!orderId || !newStatus){
            console.log("OrderId or new status is missing at cont");
            return res.status(500).json({error:"OrderId or new status are missing at cont"})
        }
        const updatedOrder = await orderService.updateOrderStatus(orderId,newStatus);
        

        if(newStatus === "Ready"){
          try{
             await orderService.handleDeliveryAssignment(updatedOrder);
            }catch(error){
            return res.status(500).json({error:"Failed to fetch nearby delivery boys"})
           }
        }
        return res.status(200).json({ message: "Status updated successfully",updatedOrder });

    }catch(error){
        console.log("error updating order status",error)
        return res.status(500).json({error:"Failed to update order status"})

    }
}

module.exports.addClinicReply = async(req,res)=>{
    try{
        const {clinicReply} = req.body;
        const {orderId} = req.params
        
        const response = await orderService.addClinicReply(orderId,clinicReply);
    }catch(error){
        console.log("error updating order status",error)
        throw error;
    }
    
}

module.exports.uploadBill = async(req,res)=>{
    try{
        const {orderId} = req.params;
        const medicineTotalPrice = req.body.medicineTotalPrice;
        const billText = req.body.billText
        const billReceipt = req.files?.receipt?.[0];

        console.log("bill text and medicine total",billText,medicineTotalPrice);

        if(!billText && !billReceipt){
            res.status(400).json({error:"Please provide either a bill text or a bill receipt"});
            return
        }

        const newData = {};
        if(billText){
            newData.billText = billText;
        }
        if(billReceipt){
            newData.billReceipt={
                data:billReceipt.buffer,
                contentType:billReceipt.mimetype,
            }
        }
        if(medicineTotalPrice){
            newData.medicineTotalPrice = medicineTotalPrice
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId,newData,{new:true});
        return res.status(200).json(updatedOrder);
        


        
         
    }catch(error){
        console.error('Upload bill error:', error);
       res.status(500).json({ error: 'Failed to upload bill' });
    }

}

module.exports.fetchAllNotification = async(req,res)=>{

    const  {delBoyId} = req.params;
    try{
        const allNotification = await OrderNotificationModel.find({delBoyId});
        res.status(200).json({"allNotification":allNotification});
        
    }catch(err){
        res.status(500).json({error:"Failed to fetch all notification"});
    }
}

module.exports.markAllSeen = async(req,res)=>{
    try{
        const {delBoyId} = req.params;
        await OrderNotificationModel.updateMany( {delBoyId},{$set:{isSeen:true}});
    }catch(err){
        res.status(500).json({error:"Failed to mark all seen"});
    }
}

module.exports.updateOrderNotificationStatus = async(req,res)=>{
    try{
        const {delBoyId} = req.params;
        const {orderId,newStatus} = req.body;
        await orderService.updateOrderNotificationStatus(delBoyId,orderId,newStatus);
         
        return res.json("done");
    }catch(error){
        return res.status(500).json({error:"Failed to update order notification status"})
    }
}

module.exports.updateRejectStatus = async(req,res)=>{
    try{
        const {orderNotificationId,newStatus} = req.body;
        await orderService.updateRejectStatus(orderNotificationId,newStatus);
    }catch(error){
        return res.status(500).json({error:"Failed to update order reject status"})
    }
}

module.exports.verifyOtp = async(req,res)=>{
    const  {otp} = req.body;
    const {orderId} = req.params;
    try{

        const order = await otpModel.findOne({orderId});
        const otpOrderId = order._id
        const orderOtp = order.otp
        if(orderOtp === otp){
            await otpModel.findByIdAndDelete(otpOrderId)
            return res.status(200).json({success:"OTP verified"})
        }else{
            return res.status(400).json({error:"Invalid OTP"});
        }
    }catch(error){
        res.status(500).json({error:"Invalid otp"})
    }
}

module.exports.generateOtp = async(req,res)=>{
    const  {orderId} = req.params;
  
    if (!orderId) return res.status(400).json({ message: "Order ID required" });
    try{
        const otp = generateOtp()
        const order = await otpModel.findOne({orderId})
 
        if(order && order.otp){
            await otpModel.findByIdAndUpdate(order._id,{otp,createdAt: new Date()})
        } else {
        // this handles new orders (order is null)
            await otpModel.create({ orderId, otp });
        }
         
         
        return res.status(200).json(otp)
        
    }catch(error){
        res.status(500).json({error:""})
    }
}

const removeExpiredOtps = async () => {
  const expiryTime = new Date(Date.now() - 300 * 1000); // jo 300 seconds ago otp hai delete them

  try {
    const result = await otpModel.deleteMany({
      createdAt: { $lt: expiryTime }
    });

  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

// Call this function after every 60  abhi model k trhough hi otp remove hu rhi hai so for now no need of this fun but in future if u needed then use it
// setInterval(removeExpiredOtps, 60 * 1000);





 