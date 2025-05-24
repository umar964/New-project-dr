import React,{useState} from 'react'
import '../drhome.css'
import { Link,useNavigate } from 'react-router-dom';

 

const DrHome = () => {
  const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const drToken = localStorage.getItem('drToken');
   


    const toggleMenu = () => {
        setIsOpen(!isOpen);
      };
  return (
     <div className="home">
         <header className="header">
        <div className="logo">Healify</div>
        <div className="icons">
          <span className="notification">🔔</span>
              
       <div className="fab-container">
        <button className="fab" onClick={toggleMenu}>
          {isOpen ? '✕' : '+'}
        </button>
        {isOpen && (
          <div className="fab-menu">
             
            <Link  to = '/drallappoint' className="fab-action">All Appointment</Link>
            <Link  to = '/add-my-clinic' className="fab-action">Add My Clinic</Link>
            <Link  to = '/my-clinic-dr' className="fab-action">My Clinic</Link>
            <Link  to = '/my-pending-clinic-dr' className="fab-action">Pending Clinic</Link>
            <button onClick={()=>navigate('/findclinic')} className="fab-action">Find Clinic Near Me</button>
            <button onClick={()=>navigate('/pending-consultation')} className="fab-action">Pending Consultation</button>
            <button onClick={()=>navigate('/dractiveappoint')} className="fab-action">Active Appointment</button>
            <button onClick={()=>navigate('/dr/logout')} className="fab-action">Logout</button>
            
          </div>
        )}
      </div>
           

        </div>
         
      </header>
     </div>
  )
}

export default DrHome