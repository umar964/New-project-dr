import React, { useEffect, useState } from 'react'
import { useParams,useLocation } from 'react-router-dom';
import axios from 'axios';

const AllMedOrders = () => {
    const {clinicId} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get("status");
    const [billForm,setBillForm] = useState('');
    const [receipt,setReceipt] = useState({});
    const [medicineTotal,setMedicineTotal] = useState('');
    const [allOrders,setAllOrders] = useState([]);
    const [error,setError] = useState('');
    const [filteredOrder,setFilteredOrder] = useState([]);
    const [otp,setOtp] = useState('')
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

    },[status,allOrders]);

    const handleOrderStatus = async(orderId,newStatus)=>{
    try{
    //create formData  to send text bill or receipt image to backend
    const formData = new FormData();

    const billText = billForm[orderId];
    const receiptFile = receipt[orderId];
    const medicineTotalPrice = medicineTotal[orderId];

       if (billText){
        formData.append('billText',billText);
       }

       if(receiptFile){
        formData.append('receipt',receiptFile);
       }

       if(medicineTotalPrice){
        formData.append('medicineTotalPrice',medicineTotalPrice)
       }

       if(billText || receiptFile){
        const response1 = await axios.post(`${import.meta.env.VITE_BASE_URL}/order/uploadBill/${orderId}`,formData,{
            headers:{
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response1.status === 500){
          setError("Failed to upload bill")
        }
        if(response1.status === 400){
          setError("Please provide bill or a receipt")
        }
      }

      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/order/updateOrderStatus/${orderId}`,
      {newStatus});
      if(response.status === 500){
        setError("Failed to update status");
        return
      }
      setError('');
      // alert('Status updated and bill uploaded');
       }catch(error){
        console.error('Something went wrong:', error);
        setError("Failed to update status and bill uploaded")

       }

    }

    const handleGetOtp = async(orderId)=>{
      try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/order/generate-otp/${orderId}`);
        const otp = response.data
        setOtp(prev => ({ ...prev, [orderId]: otp }));
      }catch(error){
        setError("Failed to generate OTP")
      }
    }
  

       

  return (
    <div>
        <h2>{status ? `${status} orders`:"All orders"}</h2>
        {error && <p color='red'>{error}</p>}
         

         {filteredOrder.length ===0?(
            <p>No order found</p>
         ):(
            filteredOrder.map((order,index)=>(
                <div key={index} style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                 <div className="allOrders" style={{ padding:'20px', display:'flex', flexDirection:'column' ,background: 'red', alignItems:'end'}}>
                        <div className="orders" style={{height:"250px" ,background:"#b2b2b2", zIndex:"9", display:"flex", width:"80vw", justifyContent:"space-between", marginTop:"1px", padding:"20px"}}>
                        <div className="left" style={{  width:"50%"}}>
                             
                            <strong>Medicine:</strong> {order.medicine} <br />
                            <strong>OrderId:</strong> {order._id} <br />
                            <strong>Instructions:</strong> {order.medicineInstructions || "None"} <br />
                            <strong>Ordered by:</strong> {order.userName}<br />
                            <strong>Status:</strong> {order.status}<br />
                            <strong>Comment:{order.comment}</strong><br />
                            <strong>You responded: {order.clinicReply}</strong> <br />
                            <strong>Contact Number : {order.deliveryAddress?.contactno}</strong> <br />
                            {status.toLowerCase() === 'ready' && (
                            <p><strong>Pickup OTP: {otp[order._id]}</strong></p>
                          )}
                                  
                            </div>

                          {status.toLowerCase() === 'accepted' &&(
                                <div className="center"  style={{  width:"50%", fontSize:"1.1rem", marginTop:"-20px", background:'green'}} >
                                 <div className="uploadReceipt">
                                <label htmlFor = "uploadReceipt"> Upload Receipt Image or Pdf</label> <br />
                                <input type="file" id='uploadReceipt' accept='image/*,application/pdf' onChange={(e)=>setReceipt({[order._id]:e.target.files[0]})}/>
                                 </div>
                                <p>Or</p>
                                <div className="billForm">
                                <label htmlFor = "billForm">Type medicine name and their price </label> <br />
                                <textarea value={billForm[order._id]}  onChange={(e)=>setBillForm({[order._id]:e.target.value})} id="billForm"></textarea>

                                </div>
                                <label htmlFor = "medicineTotal">Total Amount</label> <br />
                                <input type='number' id='medicineTotal' value={medicineTotal[order._id]} onChange={(e)=>setMedicineTotal({[order._id]:e.target.value})} required/>

                               
                            </div>
                            )}
                             
                          {status.toLowerCase() === 'accepted' &&(                            
                            <div className="right">
                            <button disabled={!billForm[order._id] && !receipt[order._id] || !medicineTotal[order._id]} onClick={()=>handleOrderStatus(order._id, 'Ready')}>Ready for deliver</button>
                             
                            <button onClick={()=>handleOrderStatus(order._id, 'Rejected')}>Reject</button>
                            </div>
                           )}

                          {status.toLowerCase() === 'ready' && (
                            <button  onClick={()=>handleGetOtp(order._id)}>Get OTP</button>
                        
                          )}

                            {status.toLowerCase() === 'rejected' &&(
                            <div className="right">
                             
                            <button onClick={()=>handleOrderStatus(order._id, 'Accepted')}>Accept</button>
                            </div>
                           )}
  
                          </div> 
                         </div>
              </div>
            ))
         )}
    </div>
  )
}

export default AllMedOrders