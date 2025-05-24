const { trusted } = require('mongoose');
const orderModel = require('../Models/orderModel');


module.exports.addOrder = async(userId,comment, userName, clinicId, medicine,deliveryAddress)=>{
    try {

        const order = new orderModel({ userId,comment, userName, clinicId, medicine,deliveryAddress});
        await order.save(); // Save the new order
         

        return order;

    } catch (error) {
        throw new Error(`Error creating order at order ser: ${error.message}`);
      
    }
}

module.exports.fetchOrder = async(clinicId)=>{
    try{
 
        const orders = await orderModel.find({clinicId});
        return orders;

    }catch(error){
        console.log("Error fetching orders at ser:", error);
        throw new Error("Failed to fetch orders");
    }
}

module.exports.fetchOrderByUserId = async(userId)=>{
    try{
 
        const orders = await orderModel.find({userId});
        return orders;

    }catch(error){
        console.log("Error fetching orders at ser:", error);
        throw new Error("Failed to fetch orders");
    }
}

module.exports.updateOrderStatus = async(orderId,status)=>{
    try{
        const updateField = {status};
         
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId,updateField,{new:true});
        // console.log("updated order",updatedOrder)
        return updatedOrder;
         
    }catch(error){
        console.log("Error updating order status at ser:", error);
        throw new Error("Failed to update order status at ser");
    }
}

module.exports.addClinicReply = async(orderId,clinicReply)=>{
    try{
        const updateField = {clinicReply}
        console.log("data at ser",clinicReply,orderId)
        const response = await orderModel.findByIdAndUpdate(orderId,updateField)
    }catch(error){
        console.log("Error adding clinic reply:", error);
        throw new Error(" Error adding clinic reply");
    }
}