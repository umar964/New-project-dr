import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import { showRouteOnMap,startLiveTracking} from '../utils/mapDirection';
import { useNavigate } from 'react-router-dom';
 


const AllNotification = () => {
    const[allNotification,setAllNotification] = useState([]);
    const[map,setMap] = useState(null)
    const [error,setError] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
    const interval = setInterval(() => {
        const delBoyId = localStorage.getItem("delBoyId");
        if (delBoyId) {
            fetchAllNotification(delBoyId);
            clearInterval(interval);
        }
    }, 100); // Check every  after 100ms

    return () => clearInterval(interval);
    }, []);

   

    const handleOrderRejectStatus = async(orderNotificationId,newStatus)=>{
        try{
            await axios.put(`${import.meta.env.VITE_BASE_URL}/order/update-reject-status`,{orderNotificationId,newStatus});
        }catch(err){
            setError('Failed to update reject status')
        }
    }

    const fetchAllNotification = async(delBoyId)=>{ 
        try{
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/all-notification/${delBoyId}`);
        setAllNotification(response.data.allNotification);
         
        
        await axios.put(`${import.meta.env.VITE_BASE_URL}/order/mark-all-seen/${delBoyId}`);
        }catch(err){
            setError('Failed to fetch all notification')
        }
    }

    // for order accepting
    const  handleOrderNotificationStatus = async(orderId,delBoyCoords,clinicLocCoords,delLocCoords,newStatus)=>{
        const delBoyId = localStorage.getItem("delBoyId");
         
        try{
             
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/order/update-OrderNotification-Status/${delBoyId}`,{orderId,newStatus});
         

        // edr map mai  navigate kru gai receive order page pr then direction show kru firstly from delivery boy to clinic or pickup location and when dell boy picked order then show clinic to dellivery location direction
        
        const [delLng, delLat] = delBoyCoords.coordinates;
        const delBoyLatLng = {lat:delLat,lng:delLng};

        const [clinicLng, clinicLat] = clinicLocCoords.coordinates;
        const clinicLatLng = {lat:clinicLat,lng:clinicLng };

        const [delLocLng,delLocLat] = delLocCoords.coordinates;
        const delLocLatLng = {lat:delLocLat,lng:delLocLng};

        navigate('/receive-order',{state:{delBoyLatLng,clinicLatLng,delLocLatLng,orderId}})
  
        }catch(err){
            setError('Failed to update accept status');
        }

    }

    return (
    <div style={{ minWidth:"100vw", paddingLeft:"40px"}}>
        <h2>AllNotification</h2>
        {error && <p>{error}</p>}
        {allNotification.length === 0 ?(
            <p>No Notification Found</p>
        ):(
            <ul>
                {allNotification
                .filter((notification)=>notification.status !== "Rejected")
                .map((Notification)=>{
                    const delBoyId = localStorage.getItem("delBoyId")
                    const acceptedByYou = Notification.acceptedBy === delBoyId;
                      

                    return(
                    <div key={Notification._id} style={{paddingBottom:"50px"}}>
                    
                        <p><strong>Clinic:</strong> {Notification.clinicName}</p>
                        <p><strong>Pickup Location:</strong>{Notification.pickupLocation}</p>
                        <p><strong>Deliver Location:</strong>{Notification.deliveryLocation}</p>
                        <p><strong>Distance:</strong>{Notification.clinicToDelLocDistance/1000} Km</p>
                        <p><strong>Estimated Time:</strong>{Notification.estimatedTimeMin} Minutes</p>
                        <p><strong>Contact Number:</strong>{Notification.contactNumber}</p>
                        <p><strong>Medicine Price:</strong>{Notification.medicineTotalPrice}</p>
                        <p><strong>Delivery Charge:</strong>{Notification.deliveryCharge}</p>
                        <p><strong>Total Amount:</strong>{Notification.totalAmount}</p>
                        <p><strong>Payment Method:</strong>{Notification.paymentMethod}</p>
                        <p><strong>Order ID:</strong> {Notification.orderId}</p>
                        <p><strong>Date:</strong> {new Date(Notification.createdAt).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date(Notification.createdAt).toLocaleTimeString()}</p>
                        <p><strong>status:</strong>{Notification.status}</p>
                        
                        {Notification.status === "Accepted" && (
                            <>
                            {acceptedByYou ? (
                            <p style={{ color: "green" }}>Accepted By You</p>
                            ):(
                            <p style={{ color: "red" }}>Accepted By Other</p>
                            )}
                            </>
                        )}
                        
                        <div style={{display:"flex"}}>
                            {Notification.status === "Pending" && (
                            <>
                            <button onClick={()=>handleOrderNotificationStatus(Notification.orderId,Notification.delBoyCoords,Notification.clinicLocCoords,Notification.delLocCoords,'Accepted')}>Accept</button>
                            <button onClick={()=>handleOrderRejectStatus(Notification._id,'Rejected')}>Reject</button>
                            </>
                            )}
                        </div>
                    
                    </div>
                        
                    ) 
                
                })}
            </ul>
        )}
        <div id="map" style={{ height: '600px', width: '100%', marginTop: '40px' }}></div>

    </div>
  )
}

export default AllNotification