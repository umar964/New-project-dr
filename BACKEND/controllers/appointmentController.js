const appointmentService = require('../services/AppointMent.service');

module.exports.bookAppointment = async(req,res)=>{
    try{
        const { userId,drId,date,time} = req.body;
        
          
        const appointment = await appointmentService.bookAppointment(userId,drId,date,time);
        res.status(200).json({
            success: true,
            message: 'Appointment booked successfully!',
            appointment
          });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message || 'Error booking appointment at AC'
          });
    }
}

module.exports.updatedAppointment = async(req,res)=>{
      const {status,newDate} = req.body;
      const{appId} = req.params;
      
       
  try{
       

      const updatedAppointment = await appointmentService.updatedAppointment(appId,status,newDate);
      res.status(200).json({
          success: true,
          message: 'Appointment status updated successfully!',
          updatedAppointment
        });

  }catch(error){
      res.status(500).json({
          success: false,
          message: error.message || 'Error update status appointment at AC'
        });
  }
}

module.exports.getUserAppointments = async (req, res) => {
    try {
      const userId = req.user._id;  
       
      if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }
  
   
      const appointments = await appointmentService.getAppointmentsByUser(userId);
      
  
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error  during fetching  the appointments'
      });
    }
  };



  module.exports.getDoctorAppointments = async (req, res) => {
    try {
      const drId = req.dr._id;  
      
      
       

      if (!drId) {
        return res.status(400).json({
            success: false,
            message: 'Doctor ID is required'
        });
    }
  
    
      const appointments = await appointmentService.getAppointmentsByDoctor(drId);
       
      
  
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error during fetching appointments'
      });
    }
  };