const consultationService = require('../services/consultationService');
 
const createConsultation = async (req, res) => {
    try {
        const { userId, doctorId, date, time } = req.body;
        
        const consultation = await consultationService.createConsultation(userId, doctorId, date, time);
        res.status(201).json({ message: 'Consultation  created successfully', consultation });
       
    } catch (error) {
        console.error('Error  creating consultation:', error);
        res.status(500).json({ message: 'Error creating consultation' });
    }
};

const getConsultationStatus = async(req,res)=>{
    const consultationId = req.params.id;
    // console.log("hyyyy");
    // console.log("consultation id at consultCont",consultationId);
    const consultation = await consultationService.fetchConsultationStatus(consultationId);
    if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
    }
    // console.log("consultation is  at consult Cont",consultation);
    // res.status(200).json({ message: 'Consultation status', consultation });
    return res.status(200).json({ status: consultation });


}

 
const updateConsultationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const consultation = await consultationService.updateConsultationStatus(req.params.id, status);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json({ message: 'Consultation status updated', consultation });
    } catch (error) {
        console.error('Error updating consultation:', error);
        res.status(500).json({success : false ,  message: 'Error updating consultation' });
    }
};

// End consultation and save details
const endConsultation = async (req, res) => {
    try {
        const { duration, notes } = req.body;
        const consultation = await consultationService.endConsultation(req.params.id, duration, notes);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json({ message: 'Consultation completed', consultation });
    } catch (error) {
        console.error('Error ending consultation:', error);
        res.status(500).json({ message: 'Error ending consultation' });
    }
};

module.exports = {
    createConsultation,
    updateConsultationStatus,
    endConsultation,
    getConsultationStatus
};

module.exports.getPendingConsultation = async(req,res)=>{
    try{
        const  {doctorId} = req.params;
        const consultation = await consultationService.getPendingConsultation(doctorId);
        res.status(200).json({consultation});
    }catch(error){
        console.log("Error fetching pending consultation");
        res.status(500).json({message :"Error fetching pending consultation"})
    }
}
module.exports.acceptConsultation = async(req,res)=>{

try{
    const  {consultationId} = req.params;
    const consultation = await consultationService.acceptConsultation(consultationId);
    res.status(200).json({consultation});
}catch(error){
    console.log("error in accepting consultation");
    throw error;
}

}