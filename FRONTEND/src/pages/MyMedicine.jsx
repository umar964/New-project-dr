import React,{useState,useEffect} from 'react'
import axios from 'axios'

const MyMedicine = () => {
  const userId = localStorage.getItem('userId');
  const[orders,setOrders] = useState('');

   useEffect(() =>{
         const fetchOrders = async()=>{

          if(!userId){
            return ;
          }
 
             try{
                 const responce = await axios.get(`http://localhost:3000/order/fetch-orders-by-userId/${userId}`);
                 console.log(responce.data)
                 setOrders(responce.data);
                 console.log("order are",orders)
             }catch(error)
             { console.error("Error fetching clinic details at clinicsDetails jsx:", error)};
            
         }
          
 
        fetchOrders();
     },[userId]);
 
    
  return (
    <div className="clinic-detail-container" style={{display:"flex", justifyContent:"center",
      flexDirection:"column", alignItems:"center"
  }}>

 

   



 
      <div className="orders-list" style={{width:"85vw", fontSize:"1em"}}>
          <h3>Orders</h3>
          {orders.length > 0 ? (
              <ul>
                  {orders.map((order) => (
                      
                   <div className="allOrders" style={{ padding:'20px', display:'flex', flexDirection:'column', alignItems:'end'}}>
                      <div className="orders" style={{height:"250px" ,background:"#b2b2b2", display:"flex", width:"80vw", justifyContent:"space-between", marginTop:"1px", padding:"20px"}}>
                      <div className="left" style={{  width:"50%"}}>
                      <li key={order._id}>
                          <strong>Medicine:</strong> {order.medicine} <br />
                           
                          <strong>Instructions:</strong> {order.medicineInstructions || "None"} <br />
                          {/* <strong>Ordered from:</strong> {order.us}<br /> */}
                          <p><strong>Status:</strong> {order.status}</p><br />
                           <strong>Comment:{order.comment}</strong> <br />
                           <strong>Clinic Reply: {order.clinicReply}</strong>

                           
                      </li>
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

                    
                    
                  ))}
              </ul>
          ) : (
              <p>No orders found.</p>
          )}
      </div>
  </div>
  )
}

export default MyMedicine