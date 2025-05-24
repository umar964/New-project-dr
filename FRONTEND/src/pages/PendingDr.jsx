import React, { useEffect, useState } from 'react'
import axios from 'axios';

const PendingDr = () => {
    const [pendingDr,setPendingDr] = useState([]);
    const clinicId = localStorage.getItem("clinicId");
    
    useEffect(()=>{
        const fetchPendingDoctor = async()=>{
            try{
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/clinic/pendingDr/${clinicId}`);
                setPendingDr(response.data);
                 
            } catch (error) {
                console.error("Error fetching pending doctors:", error);
              }
        }
        if(clinicId){
            fetchPendingDoctor();
        }
         

    },[clinicId])

    const handleStatusUpdate  = async(drId,status) =>{
       
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/clinic/update-dr-status`,{drId,clinicId,status});

      console.log("Status updated successfully:", response.data);

    }


    return (
      <div>
        <h2>Pending Doctors</h2>
        {pendingDr.length > 0 ? (
          <ul>
            {pendingDr.map((doctor) => (
              <li key={doctor._id}>
              {/* <p>{doctor.fullname.firstname} {doctor.fullname.lastname}</p> */}
              <p>Email: {doctor.email}</p>
              <p>Specialization: {doctor.specialization}</p>


            <div>
              <label>
                <input
                type="checkbox"
                checked={doctor.status === "Rejected"}
                onChange={() => handleStatusUpdate(doctor._id, "Rejected")}
                 />
                Reject
              </label>

              <label>
              <input
              type="checkbox"
              checked={doctor.status === "Issue"}
              onChange={() => handleStatusUpdate(doctor._id, "Issue")}
              />
              Issue
            </label>
            <label>
            <input
            type="checkbox"
            checked={doctor.status === "Approved"}
            onChange={() => handleStatusUpdate(doctor._id, "Approved")}
            />
           Approved
           </label>
            </div>
 

              </li>
            ))}
          </ul>
        ) : (
          <p>No pending doctors found.</p>
        )}
      </div>
    );


  
 
     

}

export default PendingDr