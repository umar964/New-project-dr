import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const  userToken  = localStorage.getItem('userToken'); 
    const navigate = useNavigate();
    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`,{
        headers:{
            Authorization : `Bearer ${userToken}` 
        }
    }).then((responce)=>{
        if(responce.status === 200){
            localStorage.removeItem("user")
            localStorage.removeItem('userToken')
            localStorage.removeItem("user");
            navigate('/userlogin')
        }
    });
  
}

export default UserLogout;