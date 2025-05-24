import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoCallPage from './VideoCallPage';


const   requestConsultation = () => {
  const { doctorId } = useParams();  
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [status, setStatus] = useState('pending');
  const appId = import.meta.env.VITE_APP_ID;
  const token = import.meta.env.VITE_APP_TOKEN;

  // Request a consultation
  const  requestConsultationHandler = async () => {
    try {
      const response = await axios.post( `${import.meta.env.VITE_BASE_URL}/consultation/create-consultation`, {
        userId: localStorage.getItem('userId'), 
        doctorId,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
      });
      setConsultation(response.data.consultation);
    } catch (error) {
      console.error('Error requesting consultation:', error);
    }
  };

  // Fetch consultation status  
  useEffect(() => {
    if (!consultation) return;



    const interval = setInterval(async () => {
      try {
        
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/consultation/get-consultationStatus/${consultation._id}`);
        console.log("status at reqCon jsx",response.data);
        console.log("status at reqCon jsx",response.data.status);
        setStatus(response.data.status);

        if (response.data.status === 'accepted' || response.data.status === 'rejected') {
          console.log("🛑 Stopping interval");
          clearInterval(interval); // Stop polling when final status is received
        }
        
      
      } catch (error) {
        console.error('Error fetching consultation status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [consultation]);

   
 

  return (
    <div>
      <h2>Request Consultation with Doctor</h2>
      {!consultation ? (
        <button onClick={requestConsultationHandler}>Request Consultation</button>
      ) : (
        <div>
          <p>Consultation Status: {status}</p>
          {status === 'accepted' && (
            <div>
            <h3>Your consultation has been accepted!</h3>
            <VideoCallPage
             appId = {appId}
             channelName="HEALIFY" 
             token = {token}
             />
          </div>
          )}

           {status === 'rejected' && (
            <div>
              <h3>Consultation Rejected</h3>
              <p>Unfortunately, the doctor has rejected the consultation. You can request again or contact the doctor.</p>
              <button onClick={requestConsultationHandler}>Request Again</button>
            </div>
          )}

        </div>
      )}
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default   requestConsultation;