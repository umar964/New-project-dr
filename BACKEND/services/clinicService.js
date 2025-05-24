const clinicModel = require('../Models/clinicModel');
const drModel = require("../Models/drModel");
 

// Search clinics near a specific location
module.exports.searchClinics = async (latitude, longitude, radius) => {
  console.log(latitude,longitude,radius)
  try {

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ message: "Missing required parameters." });
  }
  
 

    const clinics = await clinicModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: "distance",
          maxDistance: parseFloat(radius) * 1000, // Convert km into meters
          spherical: true,
        },
      },
      { $sort: { distance: 1 } }, // Sort by nearest first
    ]);
    
    return clinics;
  } catch (error) {
    throw new Error("Error searching clinics: " + error.message);
  }
};

module.exports.createClinic = async(name,email,password,location,coordinates)=>{
 try{
    const hashedPassword = await clinicModel.clinicHashPassword(password);
     
    const clinic  =  await clinicModel.create({
        name,email,password:hashedPassword,location,
        coordinates:{
            type: "Point",
            coordinates: coordinates,
        },
    });
    
    
    return clinic;
 }catch(error){
    throw new Error('Error creating clinic: ' + error.message);
 }
}

module.exports.fetchClinic = async(req,res)=>{
  try{
    const clinics = await clinicModel.find();
    return clinics;
  }catch(error){
    console.log("Error fetching clinic at clinic cont",error);
    res.status(500).json({message: "Error fetching clinic at clinic cont"})
  }
}

module.exports.clinicDetails = async(clinicId)=>{
  try{
    const clinic = await clinicModel.findById(clinicId);
    if (!clinic) {
      console.log("Clinic not found");
      throw new Error("Clinic not found: ");
  }
  return clinic;
  }catch(error){
    console.log("Error fetching clinic details at clinic ser",error);
    throw new Error("Error fetching clinic details: " + error.message);
  }
}

module.exports.searchClinicByName = async(name)=>{
  try{
    const clinics = await clinicModel.find({
      name : {$regex:name,$options : "i"},
    });
    return clinics;
  }catch(error){
    console.log("Error searching clinic by name at ser",error);
    throw new Error(" Error searching clinic by name at ser: " + error.message);

  }
}

module.exports.addDoctor = async(clinicId,doctor)=>{
  try{
 

    await clinicModel.findByIdAndUpdate(clinicId,{
      $push: { pendingDoctors: doctor._id },
    });

    await drModel.findByIdAndUpdate(doctor._id,{
      $push: { pendingClinics: clinicId },
    });

     

  } catch (error) {
    console.error("Error adding doctor to clinic:", error);
    res.status(500).json({ error: "Failed to add doctor to clinic" });
  }
}

module.exports.fetchPendingDoctors = async(clinicId)=>{
  try{
    const  clinic = await clinicModel.findById(clinicId).populate("pendingDoctors");

    if (!clinic) {
      throw new Error("Clinic not found");
    }
    return clinic.pendingDoctors;
     
  }catch(error){
    console.log("Error fetching pending doctors:", error);
    throw new Error("Error fetching pending doctors:",error)
  }
}

module.exports.updateDrStatus = async(clinicId,drId,status)=>{
  try{

    const clinic = clinicModel.findById(clinicId);
    // console.log("Clinic:", clinic);

    if (!clinic) {
       throw new Error("Clinic not found")
    }
    // console.log("clinic at ser",clinic);

    

    if(status === "Approved"){
      await clinicModel.findByIdAndUpdate(clinicId,{
        $push: { doctors: drId },
        $pull: { pendingDoctors: drId },
         
        
      });

      await  drModel.findByIdAndUpdate(drId,{
        $push: {approvedClinics: clinicId },
        $pull: { pendingClinics: clinicId },
         
        
      });

      await clinicModel.findByIdAndUpdate(clinicId, {
        $set: { drStatus: status }, // Update drStatus
      });
    
      // clinic.pendingDoctors = clinic.pendingDoctors.filter(
      //   (doc) => doc.toString() !== drId
      // );
       
    }

    clinic.drStatus = status;

     

    return { message: `Doctor status updated to ${status}` };

  }catch (error) {
    console.error("Error updating doctor status:", error);
    throw new Error(error.message || "Failed to update doctor status");
  }
}

 