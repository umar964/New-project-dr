import axios from 'axios';
import React, { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { Link } from 'react-router-dom';
import "./ClinicDashboard.css";
import { useSocket } from "../context/socketContext";

 

const DelBoyHome = () => {
  const[firstName,setFirstName] = useState('');
  const[error,setError] = useState('');
  const[success,setSuccess] = useState('');
  const[isOnline,setIsOnline] = useState('');
  const[isAvailable,setIsAvailable] = useState('');
  const[latitude,setLatitude] = useState('');
  const[longitude,setLongitude] = useState('');
  const[location,setLocation] = useState('')
  const[orderNotifications,setOrderNotification] = useState(null)
  const delBoyId = localStorage.getItem("delBoyId")

  const { orderNotification } = useSocket();
 
  const intervalRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
  const onlineStatus = localStorage.getItem("isOnline") === "true";
  const availableStatus = localStorage.getItem("isAvailable") === "true";

  setIsOnline(onlineStatus);
  setIsAvailable(availableStatus);
  }, []);


  useEffect(()=>{
    const delBoy = JSON.parse(localStorage.getItem("delBoy"));
    setFirstName(delBoy.firstName);
     
    fetchStatus();
 
  },[]);

  useEffect(() => {
    if (orderNotification) {
      setOrderNotification(orderNotification);
      // Or show toast, popup, modal, etc.
    }
  }, [orderNotification]);

  // useEffect(() => {
  //   const wasOnline = localStorage.getItem("wasOnline");
  //   if (wasOnline === "true" && !socketRef.current){
  //     const newSocket = io(import.meta.env.VITE_BASE_URL, {
  //     transports: ["websocket"]
  //     });
  //     socketRef.current = newSocket;

  //     newSocket.on("connect", () => {
  //       // alert("🟢 Socket reconnected after refresh:"+ newSocket.id);
  //       newSocket.emit("delBoy", delBoyId.toString());
  //     });
  //     newSocket.on("newOrderAssigned", (data) => {
  //     // alert("📦 New Order Assigned");
  //     setOrderNotification(data);
  //     });
  //   }
  // }, []);

//   useEffect(() => {
//   if (!socketRef.current) return;

//    socketRef.current.on("newOrderAssigned", (data) => {
//     alert("📦 New Order Assigned");
    
//     setOrderNotification(data);  // Save data
//   });

//   return () => {
//     if (socketRef.current) {
//       socketRef.current.off("newOrderAssigned");
//     }
//   };
// }, []);


  const fetchStatus = async()=>{
    const delBoyID = localStorage.getItem("delBoyId");
    try{
   
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/delBoy/fetchStatus/${delBoyID}`);
      setIsAvailable(response.data.isAvailable);
      setIsOnline(response.data.isOnline)
      console.log(response.data.isOnline,response.data.isAvailable)
    }catch(err){
      setError(err.response.error);
    }
  }

  const getLocation = ()=>{
    if(!navigator.geolocation){
      setError("Geolocation is not supported by your browser");
      return
    }
    
    navigator.geolocation.getCurrentPosition(async(position)=>{
      
      const{latitude,longitude} = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
       
      setError("");

       
    
      try{

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/delBoy/getLoc`,{latitude,longitude});
        const location = res.data.location
        setLocation(location)
         

        const delBoyId = localStorage.getItem("delBoyId");
       
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/delBoy/update-location/${delBoyId}`,
          {
            coordinates:{
              type:"Point",
              coordinates:[latitude,longitude]
            },
            location,isOnline:true
          }
        );
         
      }catch(error){
         if(error.response && error.response.status === 500){
          setError(error.response.data.error);
         }else{
          setError("something went wrong, please try again")
         }
      }
           
    },(err)=>{
      setError("Permission denied or location unavailable")
    })
  }

  const handleToggleStatus = async() =>{
    if(!isOnline){
      //  it's means  db is offline , go to online and starts access location
      localStorage.setItem("wasOnline","true");
      localStorage.setItem("isOnline","true");
      getLocation();

    // const newSocket = io(import.meta.env.VITE_BASE_URL, {
    //   transports: ["websocket"]
    // });
    //   // setSocket(newSocket)
    //   socketRef.current = newSocket;
    //   newSocket.on("connect", () => {
    //   // alert("🟢 Socket connected:", newSocket.id);
    //   alert("🟢 Socket connected: " + newSocket.id); // ✅ Correct

    //   newSocket.emit("user", delBoyId.toString());
    //   });

       

      // newSocket.on("newOrderAssigned", (data) => {
      // alert("📦 New Order Assigned");
      // setOrderNotification(data);
      // });
    
      const id = setInterval(() => {
        getLocation();
      },10000);
      // store id in intervalRef.current that's return by setinterval and it will be used when we have to stop tracking
      intervalRef.current = id;
      setIsOnline(true);
      setSuccess("Tracking start");
    }else{
      localStorage.removeItem("wasOnline");
      localStorage.setItem("isOnline", "false");
  


      // if (socketRef.current){
      // socketRef.current.disconnect();
      // socketRef.current = null
      // alert("🔴 Socket disconnected");
      //    }
      // stop setInterval  and change the status of isOnline to false at backend
        const delBoyId = localStorage.getItem("delBoyId");
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/delBoy/update-location/${delBoyId}`,
          {
            coordinates:{
              type:"Point",
              coordinates:[latitude,longitude]
            },
            location,isOnline:false
          }
        );
       
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsOnline(false);
      setSuccess("Tracking stopped")
    }
  }

  const handleAvailableStatus = async()=>{

    if(!isAvailable){
      setIsAvailable(true)
      localStorage.setItem("isAvailable", "true");

    }else{
      setIsAvailable(false)
      localStorage.setItem("isAvailable", "false");
    }

    const delBoyId = localStorage.getItem("delBoyId");
     
    const newStatus = !isAvailable;
    console.log(delBoyId,newStatus);
    try{
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/delBoy/update-available-status/${delBoyId}`,{isAvailable:newStatus});
    }catch(err){
       if(err.response && err.response.status === 500){
        console.log("error updating new status");
        setError(err.response.data.error);
       }else{
        setError("something went wrong, please try again")
       }
      

    }
    
  }

   
   
  return (
    <div>
      <h2>welcome,{firstName}</h2>
      <Link to = '/all-notification' className="fab-action">All Notification</Link>
      {error && <p style={{color:"red"}}>{error}</p>}
      {success && <p style={{color:"green"}}>{success}</p>}
      {orderNotification && (
    <div style={{
    padding: "10px",
    border: "1px solid green",
    margin: "10px 0",
    borderRadius: "8px",
    backgroundColor: "#e0ffe0"
     }}>
    <h4>📢 New Order Assigned!</h4>
    <p><strong>Clinic:</strong> {orderNotification.clinicName}</p>
    <p><strong>Pickup Location:</strong>{orderNotification.pickupLocation}</p>
    <p><strong>Deliver Location:</strong>{orderNotification.deliveryLocation}</p>
    <p><strong>Distance:</strong>{orderNotification.clinicToDelLocDistance/1000} Km</p>
    <p><strong>Estimated Time:</strong>{orderNotification.displayEstimatedTimeMin} Minutes</p>
    <p><strong>Contact Number:</strong>{orderNotification.contactNumber}</p>
    <p><strong>Medicine Price:</strong>{orderNotification.medicineTotalPrice}</p>
    <p><strong>Delivery Charge:</strong>{orderNotification.deliveryCharge}</p>
    <p><strong>Total Amount:</strong>{orderNotification.totalAmount}</p>
    <p><strong>Payment Method:</strong>{orderNotification.paymentMethod}</p>
    <p><strong>Order ID : </strong>{orderNotification.orderId}</p>
    <button onClick={() => setOrderNotification(null)}>Dismiss</button>
     </div>
    )}

      <button onClick={handleToggleStatus}>{isOnline?"Go Offline":"Go Online"}</button>
      <button onClick={handleAvailableStatus}>{isAvailable?" i'm not available":"I'm available"}</button>
      
      </div>
  )
}

export default DelBoyHome