import React,{useState} from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
 

const  ClinicLogin = () => {
 
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

     const navigate = useNavigate();
 
 

  

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
       
            const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/clinic/login-clinic`,
              {email,password},
            );
            const data = response.data;
            localStorage.setItem('clinicToken',data.clinicToken);
            localStorage.setItem('clinicId',data.clinic._id);


             
            
            setEmail("");
            setPassword("");

            navigate(`/clinic-dashboard/${data.clinic._id}`);
             
          } catch (error) {
            console.error("Error  login clinic:", error);
            alert("Failed to  login clinic.");
          }
    }

    return (
        <div>
          <h2>login</h2>
          <form onSubmit={handleSubmit}>

            <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Owner Email' required/>

            <input type='password'  value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password for clinic' required/>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
          </form>
        </div>
      );
 
}

export default ClinicLogin