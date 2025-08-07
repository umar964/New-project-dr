const { trusted } = require('mongoose');
const orderModel = require('../Models/orderModel');
const clinicService = require("../services/clinicService");
const deliveryBoyModel = require('../Models/DeliveryBoy');
const geolib = require("geolib");
const { getIO } = require('../socket');
const connectedDeliveryBoys  = require('../utils/delBoyMap');
const getLocationByCoordinates  = require('../utils/getLocation');
const calculateDeliveryCharge = require('../utils/calculateDelCharge');
const orderNotificationModel = require('../Models/OrderNotificationModel');
 

module.exports.addOrder = async(userId,comment, userName, clinicId, medicine,contactNo,deliveryAddressCoords)=>{
    try {
        const order = new orderModel({ userId,comment, userName, clinicId, medicine,contactNo,deliveryAddressCoords});
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

module.exports.fetchOrderByOrderId = async(orderId)=>{
    try{
        
        const orders = await orderModel.findById(orderId);
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

module.exports.handleDeliveryAssignment = async(updatedOrder)=>{
    try{
        const clinicId = updatedOrder.clinicId;
        const clinic = await clinicService.clinicDetails(clinicId);
       
        if(!clinic || !clinic.coordinates){
            console.log("clinic not found or coordinates are missing at order cont");
            return;
        }
        const [lng,lat] = clinic.coordinates.coordinates;
        const clinicLocationCoords = {lat,lng};
        // console.log("clinicLocationCoords",clinicLocationCoords);
        
        //  fetch actual location by coords and this will be pickup location of order
        const clinicLocation = await getLocationByCoordinates(lat,lng);
        
        //  delivery location
        const[delLng,delLat] = updatedOrder.deliveryAddressCoords.coordinates || [];
        const delLocationCoords = {lat:delLat,lng:delLng};
        // console.log("delivery location coords are",delLocationCoords);
        
        const deliverLocation = await getLocationByCoordinates(delLat,delLng);
        // console.log(deliverLocation)

        
        
        
        const allOnlineAndAvailableDB = await deliveryBoyModel.find({
            isOnline:true,
            isAvailable:true
        })
      
        const nearbyDB = allOnlineAndAvailableDB.filter((db)=>{
        const[dbLng,dbLat] = db.coordinates.coordinates || [];
        
            
        // console.log("nearby id",db._id);
        if (!dbLat || !dbLng) return false;

        const dbLocationCoords = {lat:dbLat,lng:dbLng};
           
        // distance  in meter from clinic location to db
        const clinicToDbDistance = geolib.getDistance(clinicLocationCoords,dbLocationCoords)
            // return distance <= 2000; es ko uncomment krne es sai vo db mili gai jo 2km k radius mai hunga btw abhi sare db mil rhe hai chaiya kitne b durr kyu na hu clinic sai
        // console.log("distance from clinic location to db",clinicToDbDistance/1000);
        return true
 
        });

        const clinicToDelLocDistance = geolib.getDistance(clinicLocationCoords,delLocationCoords);
       
        const speedKmh = 20;
        const distanceKm = clinicToDelLocDistance/ 1000;
        const estimatedTimeMin = (distanceKm / speedKmh) * 60;
        const displayEstimatedTimeMin = Math.floor(estimatedTimeMin)
        const deliveryCharge = await calculateDeliveryCharge(distanceKm,delLat,delLng);
        const totalAmount = Number(updatedOrder.medicineTotalPrice) + Number(deliveryCharge);
       
        
     
    nearbyDB.forEach(async (db) => {
        const io = getIO();
        const socketId = connectedDeliveryBoys.get(db._id.toString());
        const delBoyId = db._id;
        const [dbLng, dbLat] = db.coordinates.coordinates || [];

    if(socketId && dbLng !== undefined && dbLat !== undefined){
       try{
       io.to(socketId).emit("newOrderAssigned", {
       clinicName:clinic.name,
       orderId: updatedOrder._id,
       pickupLocation: clinicLocation,
       contactNumber:updatedOrder.contactNo,
       deliveryLocation:deliverLocation,
       clinicToDelLocDistance,
       displayEstimatedTimeMin,
       medicineTotalPrice:updatedOrder.medicineTotalPrice,
       deliveryCharge,
       totalAmount,paymentMethod:updatedOrder.paymentMethod
      });
    console.log(`Sent order to DB ${db._id}`);
     
    } catch (err) {
    console.log(`Emit failed for DB ${db._id}`, err.message);
    }
    }else{
        console.log(`DB ${db._id} is not connected to socket`);
    }
    //   store notification
    const orderNotification = await orderNotificationModel.create({
       orderId:updatedOrder._id,clinicId:clinic._id,userId:updatedOrder.userId,delBoyId,clinicName:clinic.name,     pickupLocation:clinicLocation,deliveryLocation:deliverLocation,
        delLocCoords:{
            type:"Point",
            coordinates:[delLng,delLat],
        },
        clinicLocCoords:{
            type:"Point",
            coordinates:[lng,lat],
        },
        delBoyCoords:{
            type:"Point",
            coordinates:[dbLng,dbLat],
        },
       clinicToDelLocDistance, 
       contactNumber:updatedOrder.contactNo,
       estimatedTimeMin:displayEstimatedTimeMin,
       medicineTotalPrice:updatedOrder.medicineTotalPrice,
       deliveryCharge,
       totalAmount,paymentMethod:updatedOrder.paymentMethod,
    });
    });

         

    }catch(error){
        throw new error("failed to fetch nearby delivery boys")
    }
}

module.exports.updateOrderNotificationStatus = async(delBoyId,orderId,newStatus)=>{
    try{
         
        await orderNotificationModel.updateMany({orderId},
            {
            status:newStatus,
            acceptedBy:delBoyId,
            isAccepted:true,
            acceptedAt:new Date()
            },{new:true});
         
    }catch(error){
        throw new error("Failed to update order notification status");
    }
}

module.exports.updateRejectStatus = async(orderNotificationId,newStatus)=>{
    try{
        await orderNotificationModel.findByIdAndUpdate(orderNotificationId,{status:newStatus},{new:true});
    }catch(error){
        throw new error("Failed to update order notification status");
    }
}


