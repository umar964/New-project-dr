import React,{useState} from 'react'
import '../bookApp.css'


const BookingAppointment = ({doctor,closeModal}) => {
    
    const [date,setDate] = useState('');
    const [time,setTime] = useState('')

    const handleBookAppointment = async()=>{
        const userId = localStorage.getItem("userId");
         
        const  drId = localStorage.getItem('presentDrId');
        
        

           
        const userToken = localStorage.getItem('userToken');
         

        const response = await fetch("http://localhost:3000/appointment/book", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ userId,drId,date, time }),
          });

          const data = await response.json();
         

          if (data.success) {
            alert("Appointment booked successfully!");
            localStorage.removeItem('presentDrId');
            closeModal();
          } else {
            alert("Error booking appointment: " + data.message);
          }
          setTime('')
          setDate('')
     

    }
  return (
    <div className="modal">
    <div className="modal-content">
      <h2>Book Appointment</h2>
      {/* <p>Doctor: Dr {doctor.fullname.firtname}</p> */}

      <label>Select Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label>Select Time:</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <button onClick={handleBookAppointment}>Confirm Appointment</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  </div>

  )
}

export default BookingAppointment;