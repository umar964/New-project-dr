import React,{useState,useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserAppointments = () => {
  const navigate = useNavigate();

    const [viewAppointments,setviewAppointments] = useState([]);

    useEffect(()=>{
        const fetchAllAppointments = async()=>{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointment/userAppointments`,{
                headers:{
                    Authorization : `Bearer ${localStorage.getItem('userToken')}`},
            });
            const data = await response.data;
            setviewAppointments(data);
           
            
        };
        fetchAllAppointments();
    },[]);


    return (
        <div>
           
          <h2>Your All Appointments</h2>

          <button onClick={()=>navigate(-1)}>Back</button>
          {viewAppointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <ul>
              { viewAppointments.map((apt) => {
                // convert the format of date from ISO to custom 
                const customDate = new Date(apt.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",  
                  year: "numeric"
                });
      
                return (
                  <li key={apt._id}>
                    <strong>Dr {apt.doctorName.firstname}    {apt.doctorName.lastname}</strong>
                    <p>{apt.status}</p>
                    <p>Date: {customDate} | Time: {apt.time} AM</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
};

export default UserAppointments