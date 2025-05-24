const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    drId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    // doctorName: { type: String, required: true },
    // userName: { type: String, required: true },
    doctorName: {  
      firstname: { type: String, required: true },
      lastname: { type: String, required: true }
  }, 
  userName: {  
      firstname: { type: String, required: true },
      lastname: { type: String, required: true }
  },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'Scheduled',enum: ['Scheduled', 'Completed', 'Rejected','Postponed'] }, // e.g., 'Scheduled', 'Completed', 'Cancelled'
    createdAt: { type: Date, default: Date.now },
  });
  
  const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
  
  module.exports = AppointmentModel;