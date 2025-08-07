import React,{useState,useEffect, useRef} from 'react';
import '../Home.css';
import { Link,useNavigate } from 'react-router-dom';
import  BookingAppointment from './BookingAppointment';
import axios from 'axios';
import { io } from "socket.io-client";

const Home = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [name,setName] = useState("")
  const [doctors,setDoctors] = useState([]);
  const [selectedDoctor, setselectedDoctor] = useState(null);
  const clinicId = localStorage.getItem('clinicId');
  const clinicToken = localStorage.getItem('clinicToken')
  const socketRef = useRef(null) 
  const userId = localStorage.getItem("userId")

  localStorage.setItem("presentDrId",selectedDoctor);

  const searchDrByName =async()=>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dr/searchdr`,{
         params:{
          drName: name
         },  
         headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          DoctorAuth: `Bearer ${localStorage.getItem('drToken')}`
      },
        
    });
      setDoctors(response.data);
    }catch(error){
      console.error('Error fetching doctors :', error);
    }
  }


  useEffect(()=>{
    fetch("http://localhost:3000/users/alldoctors")
    .then((res)=>res.json())
    .then((data)=>setDoctors(data))
    .catch((err) => console.error("Error fetching doctors", err));
    localStorage.getItem('clinicId')
  },[]);
 
 
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleVideoCall = (doctorId) => {
    navigate(`/requestconsultation/${doctorId}`);
  };

  const handleMyClinicClick = ()=>{
    if(clinicId && clinicToken){
      navigate(`/clinic-dashboard/${clinicId}`)
    }else{
      navigate('/login-clinic')
    }
  }


  return (
    <div className="home">
      {/* Header Section */}
      <header className="header">
        <div className="logo">Healify</div>
        <div className="icons">
          <span className="notification">🔔</span>
          <span className="profile">👤</span>
           
        
        </div>
         
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" 
        value ={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Search doctors, medicines, or services..." />
      </div>
      <button onClick={()=>searchDrByName()}>
        search
      </button>

       

      {/*  All Doctors List */}
      <div className="featured-doctors">
        <h2>Available Doctors</h2>
        {doctors.length > 0 ? (
          doctors.map((doc)=>(
            <div key={doc._id} className="doctor-card">
              <img src={doc.image || "https://via.placeholder.com/50"} alt="Doctor" />
              <div className="doctor-info">
                <h3>Dr {doc.fullname.firstname}</h3>
                 
                <p>{doc.specialization}</p>
                <div className="options" style={{display:"flex", gap:"12px"}}>
                <button onClick={()=>setselectedDoctor(doc._id)}> Book Appointment</button>
                <button onClick={()=>navigate('/local-appointment',{
                  state:{
                    doctorId:doc._id,docName:doc.fullname
                  }
                })} className="fab-action">Book Local Appooinment</button>
                <button onClick={() => handleVideoCall(doc._id)}>Video Call</button> <br />
                </div>
                  
                <p>⭐️⭐️⭐️⭐️</p>
              </div>
            </div>
          ))
        ):(
          <p>Loading doctors...</p>
        )
        }
         
       

      </div>
       
      {selectedDoctor && (<BookingAppointment doctor = {selectedDoctor} closeModal = {()=>setselectedDoctor(null)}/>)}
 
       {/*menu  */}
       <div className="fab-container">
        <button className="fab" onClick={toggleMenu}>
          {isOpen ? '✕' : '+'}
        </button>
        {isOpen && (
          <div className="fab-menu">
            <Link  to = '/fetch-clinic' className="fab-action">All Clinics</Link>

            <Link  to = '/drsignup' className="fab-action">Create Doctor Account</Link>

            {clinicId && clinicToken && (
              <button onClick={handleMyClinicClick} className="fab-action">My Clinic</button>
            )}

            <Link to = 'login-clinic' className="fab-action"> Clinic Login</Link> 
             

            <button onClick={()=>navigate('/findclinic')} className="fab-action">Find Clinic Near Me</button>

            <Link to ='/userappointments' className="fab-action">My Appointments</Link>

            <Link to ='/med-check' className="fab-action">Check Medicine</Link> 
            <Link to ='/my-medicine' className="fab-action">My Medicine</Link>

            <button onClick={()=>navigate('/users/logout')} className="fab-action">Logout</button>
            <button onClick={()=>navigate('/clinic-logout')} className="fab-action">Clinic Logout</button>
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="health-tips">
        <h2>Health Tips</h2>
        <p>💧 Stay hydrated daily.</p>
        <p>🏃‍♂️ Exercise regularly.</p>
      </div>

     
      <footer className="footer">
        <span>Home</span>
        <span>Appointments</span>
        <span>Medicines</span>
        <span>Profile</span>
      </footer>
    </div>
  );
  
};
 

export default Home;
