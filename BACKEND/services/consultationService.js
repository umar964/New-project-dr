const consultationModel = require('../Models/consultationModel');


module.exports.createConsultation = async(userId,doctorId,date,time)=>{

if(!userId || !doctorId || !date || !time){
    console.log( "All fields are required");
    throw new Error("All fields are required");
}
    try{
   
        const  consultation = await consultationModel.create({
        userId,
        doctorId,
        date,
        time,
        status: 'pending',

        });
        
        return consultation;
    }catch(error){
        console.log( "Error creating consultation",error);
    }
}

module.exports.fetchConsultationStatus = async(consultationId)=>{
    try{
        const consultation = await consultationModel.findById(consultationId)
        // console.log( "consultation at con ser",consultation);
        if(!consultation){
            return res.status(401).json({message:"Consultation not found at consult ser"})

        }
        // console.log( "consultation status at consult ser",consultation.status);
        return consultation.status;
         
    }catch(error){
        console.error("Error fetching  consultation status:", error);
        throw error;
    }
}



module.exports.updateConsultationStatus = async (consultationId, status) => {
    try{
        const consultation = await  consultationModel.findByIdAndUpdate(
            consultationId,
            { status },
            { new: true }
        );

        if (!consultation) {
            throw new Error("Consultation not found");  
        }
        
        return consultation;
    }catch(error){
        console.error("Error updating consultation:", error);
        throw error;
    }
};


module.exports.endConsultation = async (consultationId, duration, notes) => {
    try{
         
        const consultation = await  consultationModel.findByIdAndUpdate(
            consultationId,
            { status: 'completed', duration, notes },
            { new: true }
        );
          
        return consultation;
    }catch(error){
        console.log("Error in ending of consultation");
    }
};


module.exports.getPendingConsultation = async(doctorId)=>{
    if(!doctorId){
        throw new error("DoctorId is missing");
        console.log("DoctorId is missing");
    }

    try{
        const consultation = await consultationModel.find({doctorId,status:"pending"});
        return consultation;
    }catch(error){
        console.log("Error fetching pending consultation");
        throw error;
    }
}

module.exports.acceptConsultation = async(consultationId)=>{
    try{
        const consultation = await consultationModel.findByIdAndUpdate(
            consultationId,{status: 'accepted'},{new:true}
        );
        console.log(consultation)
        return consultation;
         
    }catch(error){
        console.log("Error in accepting consultation");
        throw error;
    }
}