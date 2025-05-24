import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import "./ClinicDashboard.css";

const ClinicDashboard = () => {
    const  {clinicId} = useParams();
    const [clinic,setClinic] = useState('');
    const [clinicReply,setClinicReply] = useState('')
    const [orders,setOrder] = useState([]);
    const [loading,setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() =>{
        const fetchClinicData = async()=>{

            try{
                const response = await axios.get(`http://localhost:3000/clinic/clinic-details/${clinicId}`)
    
                setClinic(response.data);
                 
    
                const responce1 = await axios.get(`http://localhost:3000/order/fetch-orders/${clinicId}`);
                console.log(responce1.data)
                setOrder(responce1.data);
                console.log("order are",orders)
    
                setLoading(false);
            }catch(error)
            { console.error("Error fetching clinic details at clinicsDetails jsx:", error)};
            setLoading(false);
        }
         

    fetchClinicData();
    },[clinicId]);


    const handleOrderStatus = async(orderId,newStatus)=>{
    

      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/order/updateOrderStatus/${orderId}`,
      {newStatus});

      if (newStatus.toLowerCase() === "rejected" || newStatus.toLowerCase() === "completed")
        {
        setOrder((prevOrders) =>
          prevOrders.filter((order) =>
            order._id !== orderId));
       }else{
        return
       }

     
      }


    

    const handleClinicReply = async(orderId)=>{
      console.log("clinic reply",clinicReply);
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/order/addClinicReply/${orderId}`,{clinicReply})
    }
 

    if (loading) {
        return <p>Loading clinic details...</p>;
    }

    if (!clinic) {
        return <p>Clinic not found.</p>;
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
      };


    return (
        <div className="clinic-detail-container" style={{display:"flex", justifyContent:"center",
            flexDirection:"column", alignItems:"center"
        }}>

      <header className="header">
        <div className="logo">Healify</div>
          <div className="allOrdersHeader"  style={{width:'120px', height:'30px'}}>
            All Orders
            <div className="orderStatus"  style={{width:'200px', height:'200px', backgroundColor:"#b2b2b2", paddingLeft:'12px'}}>
              <Link to= {`/all-orders/${clinicId}?status=completed`}>Completed</Link> <br />
              <Link  to= {`/all-orders/${clinicId}?status=accepted`}>Accepted</Link> <br />
              <Link  to= {`/all-orders/${clinicId}?status=rejected`}>Rejected</Link>

            </div>
          </div>
        <div className="icons">
          <span className="notification">🔔</span>
              
       <div className="fab-container">
        <button className="fab" onClick={toggleMenu}>
          {isOpen ? '✕' : '+'}
        </button>
        {isOpen && (
          <div className="fab-menu">
             
            <Link  to = '/pending-doctors' className="fab-action">Pending Doctors</Link>
            <Link  to = '/add-my-clinic' className="fab-action">Add My Clinic</Link>
            <button onClick={()=>navigate('/findclinic')} className="fab-action">Find Clinic Near Me</button>
            <button onClick={()=>navigate('/pending-consultation')} className="fab-action">Pending Consultation</button>
            <button onClick={()=>navigate('/dractiveappoint')} className="fab-action">Active Appointment</button>
            <button onClick={()=>navigate('/dr/logout')} className="fab-action">Logout</button>
            
          </div>
        )}
      </div>
           

        </div>
         
      </header>
    
        <h2 className="clinic-detail-heading">Clinic {clinic.name}</h2>
 
            <div className="clinic-detail-info">
                <p><strong>Created At:</strong> {new Date(clinic.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="orders-list" style={{width:"85vw", fontSize:"1em"}}>
                <h3>Orders</h3>
                {orders.length > 0 ? (
                    <ul>
                        {orders.map((order) => (
                            
                         <div className="allOrders" style={{ padding:'20px', display:'flex', flexDirection:'column', alignItems:'end'}}>
                            <div className="orders" style={{height:"250px" ,background:"#b2b2b2", zIndex:"9", display:"flex", width:"80vw", justifyContent:"space-between", marginTop:"1px", padding:"20px"}}>
                            <div className="left" style={{  width:"50%"}}>
                            <li key={order._id}>
                                <strong>Medicine:</strong> {order.medicine} <br />
                                 
                                <strong>Instructions:</strong> {order.medicineInstructions || "None"} <br />
                                <strong>Ordered by:</strong> {order.userName}<br />
                                <strong>Status:</strong> {order.status}<br />
                                <strong>Comment:{order.comment}</strong><br />
                                <strong>You responded: {order.clinicReply}</strong> <br />
                                 <label>
                                  Comment reply
                                 <textarea style={{zIndex:'999999'}}
                                 value={clinicReply}
                                 onChange={(e) => setClinicReply(e.target.value)}
                                 rows={3}
                                 />
                                 <button onClick={()=>handleClinicReply(order._id)}> Submit</button>
                                 </label>
                                 
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
                          <div className="checkBox" style={{height:'60px',right:'0px', width:'36%', background:'#b2b2b2', paddingLeft:'12px', fontSize:'1.3rem'}}>
                              
                          
                           <button onClick={()=>handleOrderStatus(order._id,"Rejected")}>
                            Reject
                           </button>

                           <button onClick={()=>handleOrderStatus(order._id,"Accepted")}>
                            Accepted
                           </button>

                           <button onClick={()=>handleOrderStatus(order._id,"Ready")}>
                            Ready for deliver
                           </button>

                           <button onClick={()=>handleOrderStatus(order._id,"Completed")}>
                            Complete
                           </button>
 
                          </div>
                         </div>

                          
                          
                        ))}
                    </ul>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
        
        
    );
  
  }

export default ClinicDashboard