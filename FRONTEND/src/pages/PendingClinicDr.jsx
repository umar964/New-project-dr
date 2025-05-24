import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingClinicDr = () => {
    const [pendingClinics,setPendingClinics] = useState([]);
    const drId = localStorage.getItem('drId');
    const navigate = useNavigate()

    useEffect(()=>{

        const fetchPendingClinics = async()=>{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dr/pending-clinic-dr`,{
                params:{ drId },
            })
            setPendingClinics(response.data);
        }
        fetchPendingClinics();
    },[])

    const handleClinicClick = (clinicId)=>{
        navigate(`/clinic/${clinicId}`);
    }
  return (
    <div className="my-clinic-dr">
        <h2>Your Pending Clinics</h2>
        {pendingClinics.pendingClinics && pendingClinics.pendingClinics.length > 0 ? (
               <div className="clinic-list">
               {pendingClinics.pendingClinics.map((clinic) => (
                   <div key={clinic._id} className="clinic-card" onClick={()=>{handleClinicClick(clinic._id)}}>
                       <h3>Name: {clinic.name}</h3>
                       <p>Location: {clinic.location}</p>
                       {/* Add other clinic details you want to display */}
                   </div>
                   
               ))}
           </div>

        ):(
            <p className="no-clinics-message">
            { pendingClinics.pendingClinics ? "No pending clinics found" : "Loading clinics..."}
        </p>
        ) }
        
    </div>
  )
}

export default PendingClinicDr