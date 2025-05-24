import React, {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

    const  DrActiveAppointment = () => {
        const [appointments,setAppointments] = useState([]);
          useEffect(()=>{
                    //  here we are just declaring the fetchAllAppointments function  what the function does. But it won't run automatically unless we call it
                  const fetchActiveAppointments = async () => {
                
                  try{
                    
                      const response  = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointment/doctorAppointments`,{
                          headers: {
                                    Authorization: `Bearer ${localStorage.getItem('drToken')}`},
                      });
      
                      const data = await response.data;
                      setAppointments(data);
                       
      
                      }catch(error){
                          console.error('Error fetching appointments at allapt page:', error);
                         }
                
                        
                      };
                
                    fetchActiveAppointments(); // Call the function when page loads
                    
       
          },[])
      
          const handleStatusUpdate = async(appId,newStatus)=>{
            try{
              let newDate = null;
              if (newStatus === "Postponed") {
                
                const dateInput = prompt("Enter the new date for the appointment (YYYY-MM-DD):");
                if (!dateInput) {
                  console.error("New date is required for postponed appointments.");
                  return;
                }
                newDate = new Date(dateInput).toISOString(); // Convert to ISO format
              }
              const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/appointment/updatedAppointment/${appId}`,
                {status:newStatus,newDate},
                {
                  headers: {
                            Authorization: `Bearer ${localStorage.getItem('drToken')}`,},
              }
      
              );
      
            setAppointments((prevAppointments) =>
              prevAppointments.map((apt) =>
                apt._id === appId ? { ...apt, status: newStatus,date: newDate || apt.date} : apt
              )
            );
      
            }catch(error){
              console.error("Error updating status:", error);
            }
      
          }
      
        
      
        return (
          <div>
            <h2>Doctor's Appointments</h2>
            {appointments.length === 0 ? (
              <p>No  active appointments found.</p>
            ) : (
              <ul>
                {appointments.map((apt) => {
                  // convert the format of date from ISO to custom 
                  const customDate = new Date(apt.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",  
                    year: "numeric"
                  });
        
                  return (
                    <li key={apt._id}>
                      <strong>Dr {apt.doctorName.firstname}</strong>
                      <br />
                      <strong>Patient Name: {apt.userId.fullname.firstname} {apt.userId.fullname.lastname}</strong>
                      
                      <p>{apt.status}</p>
                      <p>Date: {customDate} | Time: {apt.time} AM</p>
      
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={apt.status === "Completed"}
                            onChange={() =>
                              handleStatusUpdate(apt._id, "Completed")
                            }
                          />
                          Complete
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={apt.status === "Rejected"}
                            onChange={() => handleStatusUpdate(apt._id, "Rejected")}
                          />
                          Reject
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={apt.status === "Postponed"}
                            onChange={() => handleStatusUpdate(apt._id, "Postponed")}
                          />
                          Postponed
                        </label>
                      </div>
      
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
        
           
        
      }




export default DrActiveAppointment;