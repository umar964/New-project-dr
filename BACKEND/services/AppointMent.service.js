const appointModel = require('../Models/appointmentModel');
const userModel = require('../Models/user_model');
const drModel = require('../Models/drModel');

module.exports.bookAppointment = async(userId,drId,date,time)=>{
    
    if(!userId || !drId || !date || !time){
        throw new Error("All fields are required AS")
    }
    const user = await userModel.findById(userId);
    const doctor = await drModel.findById(drId);


    if(!user || !doctor){
        throw new Error('User or Doctor not found');


    }
    if (!doctor.fullname || !user.fullname || !doctor.fullname.firstname || !user.fullname.firstname) {
        throw new Error("Doctor or User fullname is incomplete");
    }

    const existingAppointment = await appointModel.findOne({ userId,drId, date, time });
    if (existingAppointment) {
        throw new Error("Appointment already booked for this date and time");
    }

    const newAppointment = await appointModel.create({
        userId,drId,
        doctorName:{
            firstname:doctor.fullname.firstname,
            lastname:doctor.fullname.lastname,
        },
        userName:{
            firstname: user.fullname.firstname,
            lastname: user.fullname.lastname,

        },
        date,time
    })
   
    return newAppointment;
}

module.exports.updatedAppointment = async(appId,status,newDate)=>{
     
    if(!appId || !status || !newDate){
        throw new Error("All fields are required at AS")
    }

    
  try {
    const updateFields = { status };
    if (status === "Postponed" && newDate) {
      updateFields.date = newDate; // Add the new date to the update fields
    }
    const updatedAppointment = await appointModel.findByIdAndUpdate(
      appId,
      updateFields,
      { new: true }
    );
     return updatedAppointment;
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment status" });
  }
     
    
}

module.exports.getAppointmentsByUser = async (userId) => {
   
    try {
        return await appointModel.find({userId})
            .populate('drId', 'fullname')  
            .sort({ date: 1, time: 1 });  
    } catch (error) {
        console.error('Error in getAppointmentsByUser:', error);
        throw new Error('Error fetching user appointments');
    }
  
  };
  
module.exports.getAppointmentsByDoctor = async (drId) => {
    
    try {
         

        return await appointModel.find({drId})
            .populate('userId' ,'fullname')  
            .sort({ date: 1, time: 1 });  
    } catch (error) {
        console.error('Error in getAppointmentsByDoctor:', error);
        throw new Error('Error fetching doctor appointments');
    }
 
  };