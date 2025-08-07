import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { point } from 'leaflet';
import { useNavigate } from 'react-router-dom';

const DelBoySignUp = () => {
    const[firstName,setFirstName] = useState('');
    const[lastName,setLastName] = useState('');
    const[email,setEmail] = useState('');
    const[password,setPassword]= useState('');
    const[phone,setPhone] = useState('');
    const[error,setError] = useState('');
    const navigate = useNavigate();
     

    

    const handleSubmit = async(e)=>{
        e.preventDefault();
    
        const delBoy = {firstName,lastName,email,password,phone};

        try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/delBoy/sign-up`,delBoy);
        console.log(response.data)

        if(response.status === 200){
            const data = response.data;
            console.log(data)
            localStorage.setItem("delBoy",JSON.stringify(data.delBoy));
            localStorage.setItem("delBoyToken",data.delBoyToken);
            localStorage.setItem("delBoyId",data.delBoy._id);
            navigate("/del-boy-home")
        }


        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        }catch(err){
            if(err.response && err.response.status === 500){
                setError(err.response.data.message)
            }

        }

 
         

    
    }

  return (
    <div>
        <h2>Delivery Boy singUp</h2>
        <form onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder='First name' required/>
            <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder='Last name'/>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email' required/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' required />
            <input type="number" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='contact number' required />
 
             
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">submit</button>

        </form>
    </div>
  )
}

export default DelBoySignUp