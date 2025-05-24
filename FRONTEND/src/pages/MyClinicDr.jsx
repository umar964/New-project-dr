import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const MyClinicDr = () => {
    const [myClinic,setMyClinic] = useState([]);
    const drId = localStorage.getItem('drId');
    const navigate = useNavigate()
     

    useEffect(()=>{
         

         const fetchMyClinic = async()=>{
            try{
                 
                console.log("dr id at frontend is",drId)
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dr/my-clinic-dr`,{
                    params:{drId}
                })
                setMyClinic(response.data );
                console.log("my clinic at jsx are",myClinic);

            }catch(error){
                console.error("Error fetching clinic IDs:", error);
            }
         }
         fetchMyClinic();

    },[]);

    const handleClinicClick = (clinicId)=>{
        navigate(`/clinic/${clinicId}`);
    }

  return (
    <div className="my-clinic-dr">
      <h2>Your Approved clinics</h2>
    {myClinic.approvedClinics && myClinic.approvedClinics.length > 0 ? (
        <div className="clinic-list">
            {myClinic.approvedClinics.map((clinic) => (
                <div key={clinic._id} className="clinic-card" onClick={()=>{handleClinicClick(clinic._id)}}>
                    <h3>Name: {clinic.name}</h3>
                    <p>Location: {clinic.location}</p>
                    {/* Add other clinic details you want to display */}
                </div>
                
            ))}
        </div>
    ) : (
        <p className="no-clinics-message">
            {myClinic.approvedClinics ? "No approved clinics found" : "Loading clinics..."}
        </p>
    )}
</div>
  )
}

export default MyClinicDr