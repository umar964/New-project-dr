import React,{useState,useEffect} from 'react';
import axios from 'axios';


const  FindClinic = () => {

    const [Clinic,setClinic] = useState([]);
    const [radius, setRadius] = useState(5);  
    const [userLocation, setUserLocation] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const fetchCoordinates = async()=>{
        if(!locationName){
            alert("Please enter a location name!");
            return;
        }
        try{
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`,{
                params:{
                    q:locationName,
                    format:"json",
                    limit:1
                }
            });
            if(response.data.length === 0){
                alert("Location not found! Please enter a valid place.");
                return;
            }
            const {lat,lon} = response.data[0];
            

            setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });

           

            
        }catch(error){
            console.error("Error fetching coordinates:", error);
            alert("Error fetching location. Try again.");
        }

    }

    

        useEffect(()=>{

            const fetchAllClinic = async()=>{
              
                

                const lat = coordinates?.latitude || userLocation?.latitude;


                const lon = coordinates?.longitude || userLocation?.longitude;

                if(!lat || !lon){
                    console.error("Invalid latitude or longitude!");
                    return;
                }

                console.log(lat,lon);
 
                  try{
                     
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/clinic/searchClinic`,{
                       params:{
                            latitude: lat,
                            longitude: lon,
                            radius: radius,
                       },
                       headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                        DoctorAuth: `Bearer ${localStorage.getItem('drToken')}`
                    },
                    });
                    setClinic(response.data);
                  
                  }catch(error){
                    console.error("Error fetching clinics:", error);
                  }
                };

                if (userLocation || coordinates) {
                    fetchAllClinic();
                }

            
        },[userLocation,coordinates,radius]);

 

 

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };


      
 

    return (
        <div>
            <button onClick={getUserLocation}>Use My Location</button>

            <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter location name"
            />
            <button onClick={fetchCoordinates}>Search</button>


            <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Enter radius (km)"
            />
            <ul>
                {Clinic.map((clinic) => (
                      
                    <li key={clinic._id}>{clinic.name} - {clinic.location}</li>
                ))}
            </ul>
        </div>
    );

};

export default FindClinic;