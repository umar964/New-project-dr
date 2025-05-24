const medicineService = require('../services/medicineService');
const multer = require('multer');
const upload = multer({dest:'uploads/'})



module.exports.medCheck = async(req,res)=>{
    try{
        const {name} = req.body;
        const photo = req.files?.photo?.[0]

        let medicineName = name
        
        if(photo){
            // console.log('Photo uploaded:', photo);
            const imageBuffer = photo.buffer;
            
            const medicineName = await medicineService.extractTextFromImage(imageBuffer)
        }
        const medicineDetails = await medicineService.fetchMedicineDetails(medicineName);
        res.json(medicineDetails)
    }catch(error){
        console.error('Error in checkMedicine:', error.message);

        // Handle "Medicine not found" error
        if (error.message === 'Medicine not found in the database') {
            return res.status(404).json({ error: 'Medicine not found,please recheck medicine name ' });
        }

        // Handle other errors
        res.status(500).json({ error: 'An error occurred' });

    }

}