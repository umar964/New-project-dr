const axios = require('axios')
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

module.exports.fetchMedicineDetails = async(medicineName)=>{
 
    try{
        const url = `${process.env.MED_BACKEND_URL }"${medicineName}"`;
         

   

        const response = await axios.get(url);

        if (!response.data.results || response.data.results.length === 0) {
            throw new Error('Medicine not found in the database');
        }
        
     
        return response.data.results[0];
    }catch(error){
        console.log("Error fetching medicine details at med ser")
        throw error
    }
}

 
 

module.exports.extractTextFromImage = async (imageBuffer) => {
    try {
        // Preprocess the image
        const processedImage = await sharp(imageBuffer)
            .grayscale()
            .resize(800)
            .threshold(150)
            .toBuffer();

        // Use Tesseract to recognize text from the processed image
        const { data: { text } } = await Tesseract.recognize(
            processedImage,
            'eng',
            {
                logger: m => console.log(m),
                psm: 6, // Assume a single uniform block of text
            }
        );

        console.log('Raw Extracted Text:', text); // Log the raw extracted text

        // Extract the medicine name from the text
        const medicineName = extractMedicineName(text);
        console.log('Extracted Medicine Name:', medicineName); // Log the extracted medicine name

        if (!medicineName) {
            throw new Error('No medicine name found in the extracted text');
        }

        return medicineName;
    } catch (error) {
        console.error('Error extracting text from image:', error);
        throw error;
    }
};