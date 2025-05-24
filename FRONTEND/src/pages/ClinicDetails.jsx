import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
 

const ClinicDetails = () => {
    const  {clinicId} = useParams();
    const [clinic,setClinic] = useState('');
    const [loading,setLoading] = useState(true);
    const [medicine,setMedicine] = useState('')
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = localStorage.getItem('userId');

 

    useEffect(() => {
         
        axios.get(`http://localhost:3000/clinic/clinic-details/${clinicId}`)
            .then(response => {
                 
                setClinic(response.data); 
                setLoading(false);
                 
             
            })
            .catch(error => console.error("Error fetching clinic details at clinicsDetails jsx:", error));
            setLoading(false);
    },[]);

    const  handleSubmit = async(e)=>{
        e.preventDefault();
        
        try{
             
            const response = await axios.post('http://localhost:3000/order/add-order',{
                userId,clinicId,userName:user.fullname.firstname,medicine
            })
            setClinic(response.data);
            setMedicine(' ')

        }catch(error){
            console.log("Error submitting medicine:", error);
        }
    }

    if (loading) {
        return <p>Loading clinic details...</p>;
    }

    if (!clinic) {
        return <p>Clinic not found.</p>;
    }
    

    return (
        <div className="clinic-detail-container">
            <h2 className="clinic-detail-heading">{clinic.name}</h2>
            <img
                src={clinic.image || "https://via.placeholder.com/150"}
                alt="Clinic"
                className="clinic-detail-image"
            />
            <div className="clinic-detail-info">
                <p><strong>Location:</strong> {clinic.location}</p>
                <p><strong>Rating:</strong> {clinic.rating}</p>
                <p><strong>Created At:</strong> {new Date(clinic.createdAt).toLocaleDateString()}</p>
            </div>

            {/* <form onSubmit={handleSubmit} className="medicine-form">
                <input
                    type="text"
                    placeholder="Enter medicine name"
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    required
                />
                <button type="submit">Submit Medicine</button>
            </form> */}

 
          <Link to={`/order-medicine/${clinicId}`} className="order-button"> Order Medicine</Link>

        </div>
    );
}

export default ClinicDetails