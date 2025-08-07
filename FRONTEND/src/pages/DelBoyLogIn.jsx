import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const DelBoyLogIn = () => {
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const navigate = useNavigate();
    const[error,setError] = useState('')
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log("hello")

        const delBoyData = {
            email:email,password:password
        }

        try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/delBoy/log-in`,delBoyData);

        if(response.status === 200){
            const data = response.data;
            localStorage.setItem("delBoy",JSON.stringify(data.delBoy));
            localStorage.setItem("delBoyToken",data.delBoyToken);
            localStorage.setItem("delBoyId",data.delBoy._id);
            
            navigate("/del-boy-home")

        }
        setPassword("");
        setEmail("");
        }catch(error){
            if(error.response && error.response.status === 401){
                setError(error.response.data.message)
            }else{
                setError("something went wrong,please try again later")
            }

        }

    

    }
  return (
    <div>
        <h2>Delivery boy logIn</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={handleSubmit}>
            <input type="email" value ={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' required />
            <input type="password" value ={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' required />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">submit</button>
        </form>
    </div>
  )
}  

export default DelBoyLogIn 