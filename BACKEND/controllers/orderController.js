const orderService = require('../services/orderServices');
const { clinicDetails } = require('./clinicController');

module.exports.addOrder = async(req,res)=>{
    try{
         
        const {userId,userName,comment,clinicId,medicine,deliveryAddress} = req.body;

        // console.log("hello",comment); 

        const order = await orderService.addOrder(userId,comment,userName,clinicId,medicine,deliveryAddress);

        res.status(201).json(order);

    }catch(error){

        console.log("Error adding order at order cont",error);
        res.status(500).json({message:"Error adding order at  order cont"})

    }
}

module.exports.fetchOrder = async(req,res)=>{
    try{
        const  {clinicId} = req.params;
        
        if(!clinicId){
            console.log("clinicId is missing")
        }
        const orders = await orderService.fetchOrder(clinicId);
        
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

module.exports.updateOrderStatus = async(req,res)=>{
    try{
         
        const {orderId} = req.params;
        const {newStatus} = req.body;
         

        if(!orderId){
            console.log("OrderId is missing at cont")
        }
        const updatedOrder = await orderService.updateOrderStatus(orderId,newStatus);
    }catch(error){
        console.log("error updating order status",error)
        throw error;

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