import React, { useEffect, useState } from 'react'
import { useParams,useLocation } from 'react-router-dom';
import axios from 'axios';

const AllMedOrders = () => {
    const {clinicId} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    const [allOrders,setAllOrders] = useState([]);
    const [filteredOrder,setFilteredOrder] = useState([]);
    useEffect(()=>{

        const fetchAllOrders = async()=>{
            // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/fetch-orders/${clinicId}`);
            const response = await axios.get(`http://localhost:3000/order/fetch-orders/${clinicId}`);
            setAllOrders(response.data);
             
             
        };
        fetchAllOrders();

    },[clinicId]);
 


    useEffect(()=>{
        if(status && allOrders.length>0){
            const filtered = allOrders.filter(order=>order.status.toLowerCase() === status.toLowerCase());
            setFilteredOrder(filtered)
        }else{
            setFilteredOrder(allOrders);
        }

    },[status,allOrders])
  return (
    <div>
         <h2>{status ? `${status} orders`:"All orders"}</h2>
         
          
         {filteredOrder.length ===0?(
            <p>No order found</p>
         ):(
            filteredOrder.map((order,index)=>(
                <div key={index} style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                 <div className="allOrders" style={{ padding:'20px', display:'flex', flexDirection:'column', alignItems:'end'}}>
                            <div className="orders" style={{height:"250px" ,background:"#b2b2b2", zIndex:"9", display:"flex", width:"80vw", justifyContent:"space-between", marginTop:"1px", padding:"20px"}}>
                            <div className="left" style={{  width:"50%"}}>
                             
                                <strong>Medicine:</strong> {order.medicine} <br />
                                 
                                <strong>Instructions:</strong> {order.medicineInstructions || "None"} <br />
                                <strong>Ordered by:</strong> {order.userName}<br />
                                <strong>Status:</strong> {order.status}<br />
                                <strong>Comment:{order.comment}</strong><br />
                                <strong>You responded: {order.clinicReply}</strong> <br />
                                  
                                 
                            
                            </div>
                            <div className="right"  style={{  width:"50%", fontSize:"1.1rem", marginTop:"-20px"}} >
                                <h2>Delivery Address</h2>
                                City: {order.deliveryAddress?.city} <br />
                                State: {order.deliveryAddress?.state} <br />
                                Street: {order.deliveryAddress?.street} <br />
                                Postal Code: {order.deliveryAddress?.postalCode} <br />
                                Exact Location: {order.deliveryAddress?.exactLocation} <br />
                                Contact No: {order.deliveryAddress?.contactno}<br/>
                                Date : {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                             
                          </div>
                           
                         </div>
                
              </div>

            ))
         )}

    </div>
  )
}

export default AllMedOrders