import React,{useEffect,useState} from 'react'
import axios from 'axios';


const AddMyClinic = () => {
    const [searchQuery,setSearchQuery] = useState('');
    const [clinics, setClinics] = useState([]);
    const drId = localStorage.getItem('drId');
    // console.log("drId",drId); working
    const [doctor,setDoctor] = useState([]);

    const handleSearch = async(e)=>{
        e.preventDefault();
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/clinic/search-clinic-byName`,{
            params : {name:searchQuery},
        });
        setClinics(response.data);
        setSearchQuery('')
    }

    const handleSelectClinic =async(clinicId)=>{
        console.log("clinic id",clinicId);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/clinic/add-doctor/${clinicId}`,
            {doctor},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("drToken")}`, // Include token
                  },
            }
 
        );
        alert("Clinic selected! Your details have been sent for verification.");




    }

    useEffect(() => {
        const fetchDoctor = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dr/get-doctor`, {
              params: { drId },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("drToken")}`,
              },
            });
         
            setDoctor(response.data);  
          } catch (error) {
            console.error("Error fetching doctor:", error);
          }
        };
      
        if (drId) {
          fetchDoctor();  
        }
      }, [drId]);



  return (
    <div>
         <h2>AddMyClinic</h2>
         <form onSubmit={handleSearch}>
         <input
          type="text"
          placeholder="Search clinic by name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button onClick={handleSearch}>Search</button>
         </form>
        
 
        <li key={doctor._id}>
            {/* {doctor.email}  working */}
        </li>
         
        <ul>
        {clinics.map((clinic)=>(
            <li key = {clinic._id}>
                    {clinic.name} - {clinic.address}
                      <button onClick={() => handleSelectClinic(clinic._id)}>Select</button>

            </li>
        ))}
 
        </ul>

        </div>
  )
}

export default AddMyClinic