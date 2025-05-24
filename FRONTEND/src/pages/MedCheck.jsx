import React,{useState,useEffect} from 'react'
import axios from 'axios';


const MedCheck = () => {
    const [medicineName,setMedicineName] = useState('');
    const [photo,setPhoto] = useState(null);
    const [result,setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BASE_URL

    const handleNameChange = (e) =>{
        setMedicineName(e.target.value);
    }

    const handlePhotoChange = (e) =>{
        setPhoto(e.target.files[0])
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        setError(null)
        setResult('')

        if (!medicineName && !photo) {
            setError('Please enter a medicine name or upload a photo.');
            setLoading(false);
            return;
        }


        const formData = new FormData();
        if (photo) {
            formData.append('photo', photo);
        } else {
            formData.append('name', medicineName);
        }
    
      

       try{
        // console.log("med name at jsx",medicineName);  working
        const response = await axios.post(`${BACKEND_URL}/med/med-check`,formData, {  
            headers: { 'Content-Type': 'multipart/form-data' }  
        });
        
        setResult(response.data);
        
       }catch(err){
        setError('Medicine not found,please recheck medicine name');
        console.error('Error:', err);
           
       } finally {
        setLoading(false);
    }
    }
  return (
    <div>
        <h1>Check your medicine</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Medicine name</label>
                <input type="text" value={medicineName} onChange={handleNameChange} />
            </div>
            <div>
                <label>Upload Photo</label>
                <input type="file" accept='image/*' onChange={handlePhotoChange} />
            </div>
            <button type="submit" disabled={loading}>
                    {loading ? 'Checking...' : 'Check'}
                </button>

        </form>
        {error && <p style={{ color: 'red',background :'black',padding : '10px'}}>{error}</p>}
        {result && (
                <div>
                    <h2>Medicine Details</h2>
                    <div>
                        <strong>Brand Name:</strong> {result.openfda?.brand_name?.[0]}
                    </div>
                    <div>
                        <strong>Generic Name:</strong> {result.openfda?.generic_name?.[0]}
                    </div>
                    <div>
                        <strong>Dosage:</strong> {result.dosage_and_administration?.[0]}
                    </div>
                    <div>
                        <strong>Uses:</strong> {result.indications_and_usage?.[0]}
                    </div>
                    <div>
                        <strong>Side Effects:</strong> {result.warnings?.[0]}
                    </div>
                </div>
            )}
    </div>
  )
}

export default MedCheck