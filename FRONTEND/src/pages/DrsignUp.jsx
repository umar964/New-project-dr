 import '../drsign.css'
 import React, { useContext, useState } from 'react';
 import axios from 'axios';
 import { DrContext } from '../context/DrContext';
 
import {useNavigate} from 'react-router-dom';




 

const  DrsignUp = () => {

    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [regNo, setregNo] = useState('')
    const [regDate, setregDate] = useState('')
    const [smc, setSmc] = useState('')
    const [spec, setSpec] = useState('')
    const [exp, setExp] = useState('')
    const [loc, setLoc] = useState('')

  
  const [drData, setdrData] = useState({});

  const navigate = useNavigate();
  const{ dr,setDr} = useContext(DrContext);

  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Neurologist',
    'Gynecologist',
    'Psychiatrist',
    'General Physician',
    'Dentist',
    'ENT Specialist',
    'Other',
  ];

  const medicalCouncils = [
    'Andhra Pradesh Medical Council',
    'Arunachal Pradesh Medical Council',
    'Assam Medical Council',
    'Bihar Medical Council',
    'Bombay Medical Council',
    'Chhattisgarh Medical Council',
    'Delhi Medical Council',
    'Goa Medical Council',
    'Gujarat Medical Council',
    'Haryana Medical Council',
    'Himachal Pradesh Medical Council',
    'Jammu and Kashmir Medical Council',
    'Jharkhand Medical Council',
    'Karnataka Medical Council',
    'Kerala Medical Council',
    'Madhya Pradesh Medical Council',
    'Maharashtra Medical Council',
    'Manipur Medical Council',
    'Meghalaya Medical Council',
    'Mizoram Medical Council',
    'Nagaland Medical Council',
    'Odisha Medical Council',
    'Puducherry Medical Council',
    'Punjab Medical Council',
    'Rajasthan Medical Council',
    'Sikkim Medical Council',
    'Tamil Nadu Medical Council',
    'Telangana Medical Council',
    'Tripura Medical Council',
    'Uttar Pradesh Medical Council',
    'Uttarakhand Medical Council',
    'West Bengal Medical Council',
    'Other Medical Council',
  ];

   

 
  
   
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const experience = parseInt(exp, 10);
    const isValidExperience = isNaN(experience) || experience < 0 ? 0 : experience;
    


    
      const newDr = {
        fullname:{
          firstname:firstName,
          lastname:lastName
       },
       email:email,
       password:password,
       phone,
       specialization:spec,
       experience:isValidExperience,
       location:loc,
       regNo,regDate,smc
      }

      try {
       
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/dr/register`,newDr);

      if(response.status === 201){
        
        const data = response.data;
        setDr(data.dr);
        localStorage.setItem('drToken',data.drToken);
        localStorage.setItem("drId", data.dr._id);
        navigate("/drhome");
      }

       

    } catch (error) {
     console.log(error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Doctor Signup</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={firstName} 
          onChange={(e)=>{
            setfirstName(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={lastName}
            
          onChange={(e)=>{
            setlastName(e.target.value)
            autoComplete="off"
          }}
           
          className="input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email} 
          onChange={(e)=>{
            setEmail(e.target.value)
            autoComplete="off"
          }}
           
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={ password}
           
          onChange={(e)=>{
            setPassword(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={ phone}
          
          onChange={(e)=>{
            setPhone(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        />

        <input
          type="text"
          name="regNo"
          placeholder="Registration Number"
          value={regNo}
          
          onChange={(e)=>{
            setregNo(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        />
        <label className='regDateLabel'>Registration Date </label>
        <input
          type="Date"
          name="regDate"
          value={regDate}
          onChange={(e)=>{
            setregDate(e.target.value)
            autoComplete="off"
          }}
           
          className="input"
          id='date'
          required
        />
          

        <select
          name="state-medical-council"
          value={smc}
           
          onChange={(e)=>{
            setSmc(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        >
          <option value="" disabled> <p>State Medical Council</p></option>
          {medicalCouncils.map((smc, index) => (
            <option key={index} value={smc}>
              {smc}
            </option>
          ))}
        </select>

 
          <select
          name="specialization"
          value={spec}
           
          onChange={(e)=>{
            setSpec(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        >
          <option value="" disabled>Select Specialization</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="experience"
          placeholder="Experience (years)"
          value={exp}
           
          onChange={(e)=>{
            setExp(e.target.value)
             
          }}
          className="input"
        />
        <input
          type="text"
          name="location"
          placeholder="Address"
          value={ loc}
          
          onChange={(e)=>{
            setLoc(e.target.value)
            autoComplete="off"
          }}
          className="input"
          required
        />
        <button type="submit" className="button">Sign Up</button>
      </form>
    </div>
  );

};
 
export default DrsignUp;