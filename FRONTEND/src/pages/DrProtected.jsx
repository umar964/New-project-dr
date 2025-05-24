import React,{useContext,useEffect} from 'react'
import { DrContext } from '../context/DrContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const DrProtected = ({children}) => {

    const drToken = localStorage.getItem('drToken')
    const navigate = useNavigate();
    useEffect(()=>{
        if(!drToken){
            navigate('/drlogin');
        }else{
           try {
             // Decode the token to check expiration
             const decodedToken = jwtDecode(drToken);
             const currentTime = Date.now() / 1000; // Convert to seconds
          
             if (decodedToken.exp < currentTime) {
                 // If token is expired, remove it and redirect to login
                 localStorage.removeItem('drToken');
                 navigate('/drlogin');
             }
            } catch (error) {
             // If token is invalid, remove it and redirect to login
             console.error("Invalid token:", error);
             localStorage.removeItem('drToken');
             navigate('/drlogin');
                 }

               }

        
    },[drToken,navigate]);
  return (
    <>
    {children}
    </>
     
  )
}

export default DrProtected;