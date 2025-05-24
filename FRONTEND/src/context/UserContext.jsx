import React, { createContext, useState } from 'react';

// Create the context
 const UserContext =  createContext();

// Context component that will wrap our data  and will provide the state to all children
const UserProvider = ({ children }) => {
     
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstName: '',
            lastName: ''
        }
    });

    return (
        <UserContext.Provider value={{user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export  {UserContext,UserProvider};
