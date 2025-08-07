import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LocalAppointment = () => {
    const location = useLocation();
    const {doctorId,docName} = location.state || {}; 

    useEffect(()=>{
        const startTime = 10;
        const endTime = 3
        const generateTimeSlots = async()=>{
            const slots = [];
            let currentTime = new Date 

        }
    })
  return (
    <div> Dr {docName.firstname}</div>
  )
}

export default LocalAppointment