import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./OrderMedicineCss.css"

import SimpleMap from './MapComponent';

const OrderMedicine = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState('');
  const [comment,setComment] = useState('')
  const [activeAddressTab, setActiveAddressTab] = useState('manual');
  const [contactError,setContactError] = useState('')
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = localStorage.getItem('userId');

  const [address, setAddress] = useState({
    type: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    exactLocation:'',
    contactno :'',
    coordinates: null // [lng, lat] for map/GPS
  });

  // console.log(address)

  // Handle manual address input
  const handleManualAddress = (e) => {
    const { name, value } = e.target;
    if(name === 'contactno'){
      if(!/^\d*$/.test(value)){
        setContactError("Only digitd allowed")
      }else if(value.length != 10){
        setContactError("Number must be exactly 10 digits")
      }else{
        setContactError('')
      }
    }
    setAddress(prev => ({
      ...prev,
      type: 'manual',
      [name]: value
    }));
  };

  // Handle map click (select location)
  const handleMapSelect = (coords) => {
    setAddress({
      type: 'map',
      coordinates: coords,
      street: '', // Will geocode later
      city: '',
      state: ''
    });
    console.log("cordinates are",coords);
  };

  // Auto-detect user's location
  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress({
          type: 'auto',
          coordinates: [pos.coords.longitude, pos.coords.latitude],
          street: '',
          city: ''
        });
      },
      (err) => alert('Error fetching location: ' + err.message)
    );
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:3000/order/add-order', {
        userName:user.fullname.firstname,
        comment,
        userId,
        clinicId,
        medicine,
        deliveryAddress: address
      });
      navigate('/');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="order-medicine-container">
      <h1>Order Medicine</h1>
      
      {/* Medicine Input */}
      <div className="medicine-section">
        <label>Medicine Name</label>
        <input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          required
        />
      </div>

        {/* Address Selection Tabs */}
        <div className="address-tabs">
        <button 
          onClick={() => setActiveAddressTab('manual')}
          className={activeAddressTab === 'manual' ? 'active' : ''}
        >
          Enter Address
        </button>
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

     

      {/* Manual Address Form */}
      {activeAddressTab === 'manual' && (
           <div className="manual-address">
          <input
            name="street"
            placeholder="Street"
            value={address.street}
            onChange={handleManualAddress}
            required
          />
          <input
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleManualAddress}
            required
          />
          <input
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleManualAddress}
            required
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={handleManualAddress} 
            required
          />
          <input
          name = "exactLocation"
          placeholder='Exact Location'
          value={address.exactLocation}
          onChange={handleManualAddress}
          required
          />
          <input
          type='text'
          name = "contactno"
          placeholder='Contact Number'
          value={address.contactno}
          onChange={handleManualAddress}
          required
          />
          <textarea
          placeholder="Add an optional comment (e.g., quantity needed, how to use, etc.)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
             />
          {contactError&& <p style={{color:"red"}}>{contactError}</p>}

          
        </div>
        
      )}

      

     {/* Map Selection - Now using OpenStreetMap */}
      {activeAddressTab === 'map' && (
        <div className="map-container">
          <SimpleMap onLocationSelect={handleMapSelect} />
          <p>Click on the map to select delivery location</p>
        </div>
      )}


    

          {/* Auto-Detected Location Display */}
    {activeAddressTab === 'auto' && address.coordinates && (
     <div className="auto-location">
          <p>
            Location: {address.coordinates[1].toFixed(4)}, {address.coordinates[0].toFixed(4)}
          </p>
          <small>(We'll fetch the exact address during delivery)</small>
        </div>
      )}

 

 

      {/* Submit Button */}
      <button 
        type="button"

        onClick={handleSubmit}
        disabled={!medicine || !address.street || !address.city || !address.postalCode ||!address.state || !address.exactLocation || !address.contactno}
      >
        Confirm Order
      </button>
    </div>
  );
};

export default OrderMedicine;