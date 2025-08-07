import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

const CreateClinic = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [location,setLocation] = useState('');
    const [pincode,setPincode] = useState('')
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [rating, setRating] = useState(1);
    
    const [coordinates,setCoordinates] = useState(null);

    const fetchCoordinates = async()=>{
        if(! location){
            alert('Please enter pincode');
            return
    }
    try{
        const query = `${location},India`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
        const data = await response.json();
        if(data.length === 0){
              alert("place not found! Please enter a valid place.");
              return;
          }
          
          const { lat,lon } = data[0];
          
          setLatitude(lat);
          setLongitude(lon);
          setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });

    }catch(error){
        alert("Error fetching location. Try again.");

    }



    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const newClinic = {
              name,
              email,
              password,
              location,
              pincode,
              coordinates: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
              },
              rating: parseFloat(rating),
            };

            console.log(newClinic);
             
      
            const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/clinic/createclinic`,
              newClinic,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("drToken")}`,
                  
                },
              }
            );

             
      
            alert("Clinic created successfully!");
            setName("");
            setEmail("");
            setPassword("");
            setLocation("");
            setLongitude("");
            setLatitude("");
            setRating(1);
          } catch (error) {
            console.error("Error creating clinic:", error);
            alert("Failed to create clinic.");
          }
    }

    return (
        <div>
          <h2>Create Clinic</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Clinic Name"  required />

            <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Owner Email' required/>

            <input type='password'  value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password for clinic' required/>

            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Specific Location"  required />

            <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="PIN code"  required />

             <button type="button" onClick={fetchCoordinates}>Get coordinates</button>


            <input type="number" value={longitude}  placeholder="Longitude" required readOnly/>
             
            <input type="number" value={latitude}   placeholder="Latitude" required  readOnly/>
            
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-5)" min="1" max="5" />

            <button onClick={()=>handleSubmit()} type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Create Clinic</button>
          </form>
        </div>
      );
 
}

export default CreateClinic