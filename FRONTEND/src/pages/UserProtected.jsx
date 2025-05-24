// import React,{useContext,useEffect} from 'react';
// import { UserContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';

// const UserProtected = ({children}) => {
     
//     const  userToken  = localStorage.getItem('userToken');
//     const navigate = useNavigate();
    

//      useEffect(()=>{
//         if(!userToken){
//             navigate('/userlogin')
//         }  
       
//      },[userToken,navigate]);
//      return (
//         <>
//            {children}
//         </>
//        );
// }

// export default UserProtected;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const UserProtected = ({ children }) => {
    const userToken = localStorage.getItem('userToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            // If no token, redirect to login
            navigate('/userlogin');
        } else {
            try {
                // Decode the token to check expiration
                const decodedToken = jwtDecode(userToken);
                const currentTime = Date.now() / 1000; // Convert to seconds

                if (decodedToken.exp < currentTime) {
                    // If token is expired, remove it and redirect to login
                    localStorage.removeItem('userToken');
                    navigate('/userlogin');
                }
            } catch (error) {
                // If token is invalid, remove it and redirect to login
                console.error("Invalid token:", error);
                localStorage.removeItem('userToken');
                navigate('/userlogin');
            }
        }
    }, [userToken, navigate]);

    // Render children only if the token is valid and not expired
    return userToken ? <>{children}</> : null;
};

export default UserProtected;