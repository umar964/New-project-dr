const drModel = require('../Models/drModel');

module.exports.createDr = async({
    firstname,lastname,email,password,phone ,specialization,experience,regNo,regDate,smc,location,createdAt
})=>{
    if(!firstname || !email || !password|| !phone || !specialization  || !location  ){
        throw new Error("All fields are required")
    }

    
    const dr = await drModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,password,phone,specialization,experience,location,regNo,regDate,smc,createdAt
    })
    return dr
}

module.exports.getDoctorByClinic = async(clinicId)=>{
    try{
        const doctors = await drModel.find({clinicId}).select('-password');
        if(!doctors){
            console.log("doctor not found at dr ser",doctors);
        }
        return doctors;
    }catch(error){
        throw new Error("Error fetching doctors at dr ser: " + error.message);
    }
}

module.exports.getDoctor = async(drId)=>{
    try{
         
        const doctors = await drModel.findById(drId).select('-password');
        if(!doctors){
            console.log("doctor not found at dr ser",doctors);
        }
         
        return doctors;
    }catch(error){
        throw new Error("Error fetching doctors at dr ser: " + error.message);
    }
}

module.exports.myClinicDr = async(drId)=>{
    try{
        const myClinicDr = await drModel.findById(drId).populate('approvedClinics');
         
        return myClinicDr
    }catch(error){
        throw new Error("Error fetching  clinic of dr at ser")
    }
}

module.exports.pendingClinicDr = async(drId)=>{
    try{
        const  pendingClinicDr = await drModel.findById(drId).populate('pendingClinics');
        
        return pendingClinicDr;
    }catch(error){
        throw new Error("Error fetching  clinic ")
    }
}

module.exports.searchdr = async(drName)=>{
    if(!drName){
        return res.status(401).json({message:"Dr noame is required"})

    }

    try{
       
       
        const doctors = await drModel.find({
            $or: [
                { "fullname.firstname": { $regex: drName, $options: "i" } }, // Case-insensitive match in firstname
                { "fullname.lastname": { $regex: drName, $options: "i" } }   // Case-insensitive match in lastname
            ]
        });
        return doctors;
    }catch(error){
        console.error('Error fetching doctors:', error);
        return res.status(401).json({message:"Error fetching dr by name"})
    }
}