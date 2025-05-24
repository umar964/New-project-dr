import React,{useEffect,useState} from 'react'
import axios from 'axios';
import'../AllClinics.css';
import { useNavigate } from 'react-router-dom';

const AllClinics = () => {
    const [clinics,setClinic] = useState([]);
    const [searchQuery,setSearchQuery] = useState('')
    const navigate = useNavigate();
  

    useEffect(() => {
      axios.get('http://localhost:3000/clinic/fetchClinic')
          .then(response => {
               
              setClinic(response.data || []); 
               
           
          })
          .catch(error => console.error("Error fetching clinic at all clinics jsx:", error));
  },[]);

  const handleClinicClick = (clinicId)=>{
    navigate(`/clinic/${clinicId}`);
     

  }

  const handleSearch = async(e)=>{
    e.preventDefault();
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/clinic/search-clinic-byName`,{
        params : {name:searchQuery},
    });
    setClinic(response.data);
    setSearchQuery('')
}



//   return (
//     <div>
//        <h2>AllClinics</h2>
//        {clinics.length > 0 ? (
//     clinics.map((clinic) => (
//         <div key={clinic._id} className='clinic-card' style={{ color: "black" }}>
//             <img src={clinic.image || "https://via.placeholder.com/50"} alt="Clinic" />
//             <div>
//                 <p>{clinic.name}</p>
//                 <p>{clinic.location}</p>
//                 <p>{clinic.rating}</p>
//             </div>
//         </div>
//     ))
// ) : (
//     <p>Loading clinic...</p>
// )}
// </div>


//   )

return (
  <div className="all-clinics-container">
      <h2 className="all-clinics-heading">All Clinics</h2>

      <form onSubmit={handleSearch}>
         <input
          type="text"
          placeholder="Search clinic by name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button onClick={handleSearch}>Search</button>
         </form>

      {clinics.length > 0 ? (
          <div className="clinic-list">
              {clinics.map((clinic) => (
                  <div key={clinic._id} className="clinic-card" onClick={()=>{handleClinicClick(clinic._id)}}>
                      <img
                          src={clinic.image || "https://via.placeholder.com/50"}
                          alt="Clinic"
                          className="clinic-image"
                      />
                      <div className="clinic-details">
                          <p className="clinic-name">{clinic.name}</p>
                          <p className="clinic-location">{clinic.location}</p>
                          <p className="clinic-rating">Rating: {clinic.rating}</p>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <p className="loading-message">Loading clinics...</p>
      )}
  </div>
);

}

export default AllClinics