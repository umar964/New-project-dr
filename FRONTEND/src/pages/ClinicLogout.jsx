import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const  ClinicLogout = () => {
    const  clinicToken  = localStorage.getItem('clinicToken'); 
    const navigate = useNavigate();
    axios.get(`${import.meta.env.VITE_API_URL}/clinic-logout`
        // use it when u will use middleware for clinic
    //     ,{
    //     headers:{
    //         Authorization : `Bearer ${userToken}` 
    //     }
    // }
).then((responce)=>{
        if(responce.status === 200){
            localStorage.removeItem('clinicToken')
            navigate('/login-clinic')
        }
    });
  
}

export default  ClinicLogout;