import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./OrderMedicineCss.css"
import MapTilerMap from './MapTilerMap';

const OrderMedicine = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState('');
  const [comment,setComment] = useState('')
  const[latitude,setLatitude] = useState('');
  const[longitude,setLongitude] = useState('');
  const[contactNo,setContactNo] = useState('');
  const[activeAddressTab,setActiveAddressTab] = useState('')
  const[error,setError] = useState('');
  const[success,setSucces] = useState('')
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = localStorage.getItem('userId');

 
 
 
 

  // Handle map click (select location)
  const handleMapSelect = (coords) => {
    const longitude = coords[0];
    const latitude = coords[1]
    setLatitude(latitude);
    setLongitude(longitude);
    
  };

  // Auto-detect user's location
  const handleDetectLocation = () => {
     if(!navigator.geolocation){
      setError("Geolocation is not supported by your browser");
      return
    }
      navigator.geolocation.getCurrentPosition(async(position)=>{
      
      const{latitude,longitude} = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      setError("");
        })}

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/order/add-order', {
        userName:user.fullname.firstname,
        comment,
        userId,
        clinicId,
        medicine,
        contactNo,
        deliveryAddressCoords:{
          type:"Point",
          coordinates:[longitude,latitude]
        }
      });
      if(response.status === 200){
        setSucces("Order successfully placed")
      }
      // navigate('/');
    } catch (error) {
      console.error('Order failed:', error);
      setError('Failed to placed order');
    }
  };

  return (
    <div className="order-medicine-container">
      <h1>Order Medicine</h1>
      {error && <p color='red'>{error}</p>}
      {success && <p color='green'>{success}</p>}


      <div className="note"><h3>Final price will be confirmed after pharmacy approval. You’ll see the receipt before paying. Payment will be done via Cash on Delivery (COD).</h3></div>
      
      
      <div className="medicine$phone-section">
        <label>Medicine Name</label>
        <input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          required
        />
        <br/>
        <label>Contact Number</label>
        <input
        type='number' 
        value={contactNo}
        onChange={(e)=>setContactNo(e.target.value)}
        required/>

      </div>

        {/* Address Selection Tabs */}
        <div className="address-tabs">
    
        <button 
          onClick={() => setActiveAddressTab('map')}
          className={activeAddressTab === 'map' ? 'active' : ''}
        >
          Choose on Map
        </button>
        <button 
          onClick={handleDetectLocation}
          className={activeAddressTab === 'auto' ? 'active' : ''}
        >
          Use My Location
        </button>
      </div>

     

  

      

     {/* Map Selection - Now using OpenStreetMap */}
      {activeAddressTab === 'map' && (
        <div className="map-container">
          <MapTilerMap onLocationSelect={handleMapSelect} />
          <p>Click on the map to select delivery location</p>
        </div>
      )}

 

 
      {/* Submit Button */}
      <button 
        type="button"

        onClick={handleSubmit}
        disabled={!medicine || !longitude || !latitude || !contactNo}
      >
        Confirm Order
      </button>
    </div>
  );
};

export default OrderMedicine;