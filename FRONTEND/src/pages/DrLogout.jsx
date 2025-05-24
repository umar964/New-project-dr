import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const DrLogout = () => {
    const  drToken  = localStorage.getItem('drToken'); 
    const navigate = useNavigate();
    axios.get(`${import.meta.env.VITE_API_URL}/dr/logout`,{
        headers:{
            Authorization : `Bearer ${drToken}` 
        }
    }).then((responce)=>{
        if(responce.status === 200){
            localStorage.removeItem('drToken')
            navigate('/drlogin')
        }
    });
  
}

export default DrLogout;