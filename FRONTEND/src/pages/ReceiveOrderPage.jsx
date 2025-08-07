import React, { useEffect, useState,useRef } from 'react'
import { showRouteOnMap,startLiveTracking} from '../utils/mapDirection';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ReceiveOrderPage = () => {
    const[otp,setOtp] = useState('');
    const[order,setOrder] = useState('')
    const mapRef = useRef(null);
    const location = useLocation();
    const {delBoyLatLng,clinicLatLng,delLocLatLng,orderId} = location.state || {};
    const[error,setError] = useState('');
    const[success,setSuccess] = useState('')
 

    useEffect(()=>{
        
        if(mapRef.current)return
        mapRef.current = L.map('map').setView([33.7734,74.0921], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
 
        showRouteOnMap(mapRef.current,delBoyLatLng,clinicLatLng);
         
         setInterval(() => {
            startLiveTracking();
         },5000);

    },[])

    useEffect(() => {
    if (!orderId) return;
    const savedStage = localStorage.getItem(`deliveryStage-${orderId}`);
    if (savedStage) {
        setStage(parseInt(savedStage));
    }
    }, [orderId]);

    useEffect(() => {
        fetchOrder()
    }, [orderId]);


    const fetchOrder = async () => {
    if (!orderId) return;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/fetch-orders-by-orderId/${orderId}`);
        setOrder(response.data);
    } catch (err) {
        setError("Failed to fetch order");
    }
    };

    const handleOtpSubmit = async()=>{
        try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/order/verify-otp/${orderId}`,{otp});
         
        // change order status to received by delivery boy only if it is in stage 1
        if(response.status === 200  && response.data.success && response.data.success === "OTP verified"){
             if(order.status === "Ready" ){
                await axios.put(`${import.meta.env.VITE_BASE_URL}/order/updateOrderStatus/${orderId}`, {newStatus: "Received"});
                await fetchOrder()
             }

            // call the map with start and end coords start and end coords are clinic location coords and delivery location coords 

            if(order.status === "Ready"  && delLocLatLng && mapRef.current){
                // move to delivery location and show route
                showRouteOnMap(mapRef.current,clinicLatLng,delLocLatLng);
                setOtp('');
                setSuccess("Clinic OTP verified. Now proceed to deliver the order.")
            }else if(order.status === "Received" ){
                //  it's mean deliver the order
                await axios.put(`${import.meta.env.VITE_BASE_URL}/order/updateOrderStatus/${orderId}`, {newStatus: "Delivered"});
                await fetchOrder()
                setSuccess("User OTP verified. Order delivered successfully.")  
            }else{
                setError("Invalid OTP")
            }
            setInterval(() => {
                startLiveTracking();
            },5000);
             
        }
        }catch(error){
            setError("Invalid OTP")
             
        }
    }
  return (
    <div style={{ minWidth:"100vw", paddingLeft:"40px"}}>
        <h2>welcome to receive order page</h2>
        {success && !error  && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p>{error}</p>}
        {order.status} <br />
        
        {order.status != "Delivered" && (
            <>
            <label htmlFor="otp">
                {order.status === "Ready" ? "Enter OTP from Clinic to receive order" : "Enter OTP from User to confirm delivery"}
            </label> <br />
            <input id='otp' type="number" value = {otp} onChange={(e)=>setOtp(e.target.value)}/>
            <button onClick={()=>handleOtpSubmit()}>Verify OTP</button>
            </>
        )}
        {order.status === "Delivered" && <h3 style={{ color: 'green' }}>✅ Order has been successfully delivered!</h3>}
         
        <div id="map" style={{ height: '491px', width: '95%', marginTop: '40px', textAlign:"center" }}></div>
    </div>
    
  ) 
}

export default ReceiveOrderPage