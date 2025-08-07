const  deliveryBoyModel = require("../Models/DeliveryBoy");

module.exports.signUp = async({firstName,lastName,email,password,phone})=>{
    if(!firstName || !lastName || !email || !password || !phone){
        throw new Error("All fields are required");
    }
    try{
        const delBoy = await deliveryBoyModel.create({firstName,lastName,email,password,phone});
        return delBoy;
    }catch(error){
        throw new Error("Error creating delivery boy account", error)
    }

}

module.exports.updateLocation = async({id,coordinates,location,isOnline})=>{
    try{
         
        const [latitude,longitude] = coordinates.coordinates;

        const response = await deliveryBoyModel.findByIdAndUpdate(id,{location,
            coordinates:{
                type:"Point",
                coordinates:[longitude,latitude],
            },
            isOnline,
        },
        {new:true}
    )
    return response;
    
    }catch(err){
        console.log("Failed to update location");
        throw new Error("Failed to update location")
    }
}

module.exports.updateAvailStatus = async({id,isAvailable})=>{
    
    try{
        const updatedDelBoy = await deliveryBoyModel.findByIdAndUpdate(id,{isAvailable},{new:true});
        return updatedDelBoy;
    }catch(err){
        throw new Error("Failed to update status")
    }
}