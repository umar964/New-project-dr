import React, { createContext, useState } from 'react';

// Create the context
 const DrContext =  createContext();

// Context component that will wrap our data  and will provide this data to all children and we can use this data in any page 
const DrProvider = ({ children }) => {
     
    const [dr,setDr] = useState({
        email: '',
        fullname: {
            firstName: '',
            lastName: ''
        }
    });

    return (
        <DrContext.Provider value={{dr,setDr }}>
            {children}
        </DrContext.Provider>
    );
};

export  {DrContext,DrProvider };