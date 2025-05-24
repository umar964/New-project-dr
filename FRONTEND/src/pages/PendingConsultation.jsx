import React,{useEffect,useState} from 'react'
import axios from 'axios';
import VideoCallPage from './VideoCallPage';
 
 

const  PendingConsultation = () => {
    const [pendingConsultation,setpendingConsultation] = useState([]);
    const [activeConsultation,setactiveConsultation] = useState(null);
    const [status,setStatus] = useState('');
   
    const doctorId = localStorage.getItem('drId');
    const [user,setUser] = useState({});

    const appId = import.meta.env.VITE_APP_ID;
    const token = import.meta.env.VITE_APP_TOKEN;
   


    useEffect(()=>{
        // console.log("ENV Variables:", import.meta.env.VITE_APP_ID, import.meta.env.VITE_APP_TOKEN);

        const fetchPendingConsultation = async()=>{
            try{
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/consultation/pending-consultation/${doctorId}`);
                setpendingConsultation(response.data.consultation);
            }catch(error){
                console.log("error fetching pending consultation");
                throw error;
            };
        };
        fetchPendingConsultation();
    },[doctorId]);

    useEffect(()=>{
        const fetchUser = async()=>{
            const userData = {};
            for(const consultation of pendingConsultation){
                const user =  await getUser(consultation.userId);
               
                userData[consultation.userId] = user;
            }
            setUser(userData);
             
        };
        if (pendingConsultation.length > 0) {
            fetchUser();
         
        }


        

    },[pendingConsultation]);
  


    const handleAcceptConsultation = async(consultationId)=>{
        try{
            const newStatus = "accepted"
            setStatus(newStatus);
            
            
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/consultation/update-consultation/${consultationId}`,{status:newStatus});
            
          
            alert("Consultation accepted successfully");
           

            const acceptedConsultation = pendingConsultation.find((consultation)=>
                consultation._id === consultationId);
            setactiveConsultation(acceptedConsultation);



            setpendingConsultation((prev) =>
                prev.filter((consultation) => consultation._id !== consultationId)
            );
        }catch(error){
            console.error('Error accepting consultation:', error);
        }

    }

    const getUser = async(userId)=>{
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/consultation/getUserById/${userId}`)
         
        return response.data;
    }

    

    return (
        <div>
            <h1>Pending Consultations</h1>
            {pendingConsultation.length > 0 ? (
                pendingConsultation.map((consultation) => (
                    
                <div key={consultation._id} className="consultation-card">
                    <p>User ID: {consultation.userId}</p>
                         

                {user[consultation.userId] && (
                <div>
                     <p>
                     Name: {user[consultation.userId].user.fullname.firstname} 
                     {user[consultation.userId].user.fullname.lastname}
                     </p>

                    <p>Email: {user[consultation.userId].user.email}</p>
                            </div>
                        )}
                       
                        <p>Date: {new Date(consultation.date).toLocaleDateString()}</p>
                        <p>Time: {consultation.time}</p>
                        <button onClick={() => handleAcceptConsultation(consultation._id)}>
                            Accept Consultation
                        </button>
                 </div>
                ))
            ) : (
                <p>No pending consultations</p>
            )}
            {activeConsultation && (
            <div>
                <h2>Video Call with {user[activeConsultation.userId].user.fullname.firstname}</h2>
                <VideoCallPage
                appId = {appId}
                channelName="HEALIFY"
                token = {token}
                    />
                </div>
            )}
        </div>
    );
 
}


export default  PendingConsultation;