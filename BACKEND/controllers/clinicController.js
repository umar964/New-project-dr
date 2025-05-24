const clinicModel = require('../Models/clinicModel');
const clinicService  = require('../services/clinicService');

module.exports.searchClinics = async(req,res)=>{
    const{latitude,longitude,radius} = req.query;
    
   
 
    try{
        const clinics = await clinicService.searchClinics(latitude,longitude,radius);
         

        res.status(200).json(clinics);
    }catch(error){
    res.status(500).json({ error: error.message });
    }
}

module.exports.fetchClinic = async(req,res)=>{
    try{
     
        const allClinic = await clinicService.fetchClinic();
        res.status(200).json(allClinic);

    }catch(error){
        console.log("Error fetching clinic at clinic cont",error);
        res.status(500).json({message: "Error fetching clinic at clinic cont"})


    }
}

module.exports.clinicDetails = async(req,res)=>{
    try{
        const clinicId = req.params.id;
         
        if (!clinicId) {
            return res.status(404).json({ message: 'ClinicId not found' });
        }

        const clinic = await clinicService.clinicDetails(clinicId);
         
        res.status(200).json(clinic);
    }catch(error){
        console.log("Error fetching clinic details at clinic cont",error);
        res.status(500).json({message:"Error fetching clinic details at cli cont"})
    }
}

module.exports.loginClinic = async(req,res)=>{
       const {email,password} = req.body;
    
    try{
      if(!email || !password){
    
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
       const clinic  = await clinicModel.findOne({email}).select('+password');
    
       if(!clinic){
          return res.status(201).json({message:'Invalid Email or Password'});
       }
    
       const isPasswordMatch = await clinic.comparepassword(password);
    
       if(!isPasswordMatch){
          return res.status(201).json({message:'Invalid Email or Password'});
       }
    
       const clinicToken = await clinic.generateAuthToken();
       res.cookie('clinicToken', clinicToken, { secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
    
      res.status(201).json({clinic,clinicToken});
    }catch(error){
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

module.exports.searchClinicByName = async(req,res)=>{
    try{
        const  { name } = req.query;
        // console.log("name is",name)
        if(!name){
            return res.status(400).json({ error: 'Query is missing ' });
 
        }
        const clinics = await clinicService.searchClinicByName(name);

 
        // console.log("clinics",clinics) working
        res.json(clinics);
    }catch(error){
        console.log("Error search clinic by name at cont");
        throw new Error("Error search clinic by name at cont")
    }
}

module.exports.addDoctor = async(req,res)=>{
    try{
        const {clinicId} = req.params;
        const {doctor} = req.body;
         
        await clinicService.addDoctor(clinicId,doctor);
        
        res.json({ message: "Doctor request sent to clinic for verification" });

    }catch(error){
        res.status(200).json({message:"error adding doctor "})
        throw new Error("Error adding doctor",error)
    }
}

module.exports.fetchPendingDr = async(req,res)=>{
    const {clinicId} = req.params;
    try{
         
        const pendingDoctors = await clinicService.fetchPendingDoctors(clinicId);
    
        res.json(pendingDoctors);
    } catch (error) {
        console.error("Error fetching pending doctors:", error);
        res.status(500).json({ error: "Failed to fetch pending doctors" });
      }
}

module.exports.updateDrStatus = async(req,res)=>{
    try{
        const {drId,clinicId,status} = req.body;
        console.log("at cont ",clinicId,drId,status);
        await clinicService.updateDrStatus(clinicId,drId,status)

    } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports.clinicLogout = async(req,res)=>{
    try{
        res.clearCookie('clinicToken')
        res.status(200).json("Logout,Sucessfully.");

    }catch(error){
        throw new Error("error during logout")
    }
}


 