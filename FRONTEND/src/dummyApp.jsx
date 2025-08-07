function App() {

  const socketRef = useRef(null);
  const { setOrderNotification } = useSocket();

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const delBoyId = localStorage.getItem("delBoyId")
     

    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
     

    if (userId) {
      socket.emit("user", userId.toString());
    }

    if (delBoyId) {
      socket.emit("delBoy", delBoyId.toString());
    }
  });

    socket.on("newOrderAssigned", (data) => {
      setOrderNotification(data); // 👉 Store in context and then use it at frontend
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });

    return () => {
      socket.disconnect(); // Cleanup if App ever unmounts means on closing web or app
    };
  }, []);

  return (
    <div >
      
    <Routes>
    <Route path = '/' element = {<UserProtected><Home/></UserProtected> } /> 
    <Route path = '/my-medicine' element={<UserProtected><MyMedicine/></UserProtected>}></Route>
    <Route path = '/all-orders/:clinicId' element={<AllMedOrders/>}></Route>
    <Route path = '/med-check' element= {<MedCheck/>} />
    <Route path = '/requestconsultation/:doctorId' element = {<RequestConsultation/>} />
    <Route path = '/pending-consultation' element = {<PendingConsultation/>} />
    <Route path = '/fetch-clinic' element={<AllClinics/>}/>
    <Route path = '/clinic/:clinicId' element = {<ClinicDetails/>}/>
    <Route path = '/clinic-dashboard/:clinicId' element = {<ClinicDashboard/>}/>
    <Route path = '/createclinic' element={<DrProtected><CreateClinic/></DrProtected>}/>
    <Route path = '/drhome' element={<DrProtected><DrHome/></DrProtected>}/>
    <Route path = '/drallappoint' element={<DrProtected><AllappointDr/></DrProtected>}/>
    <Route path = '/dractiveappoint' element={<DrProtected><DrActiveAppointment/></DrProtected>}/>
    <Route path = '/userappointments' element = {<UserAppointments/>}/>
    <Route path = '/userappointments' element = {<UserAppointments/>}/>
    <Route path = '/findclinic' element = {<FindClinic/>}/>
    <Route path = '/login-clinic' element = {<ClinicLogin/>}/>
    <Route path = '/userlogin' element = {<Userlogin/>} />
    <Route path = '/usersignup' element = {<UserSignUp/>}/>
    <Route path = '/drlogin' element = {<DrLogin/>} />
    <Route path = '/drsignup' element = {<DrsignUp/>}/>
    <Route path = '/clinic-logout' element = {<DrProtected><ClinicLogout/></DrProtected> } /> 
    <Route path = '/users/logout' element = {<UserProtected><UserLogout/></UserProtected>} /> 
    <Route path = '/dr/logout' element = {<DrProtected><DrLogout/></DrProtected>} /> 
    <Route path = '/add-my-clinic' element = {<DrProtected><AddMyClinic/></DrProtected>}/>
    <Route path = '/my-clinic-dr' element = {<MyClinicDr/>}/>
    <Route path = '/my-pending-clinic-dr' element = {<PendingClinicDr/>}/>
    <Route path = '/pending-doctors' element = {<PendingDr/>}/>
    <Route path = '/order-medicine/:clinicId' element = {<OrderMedicine/>} />
    <Route path = '/del-boy-signup' element = {<DelBoySignUp/>}/>
    <Route path = "/del-boy-home" element={<DelBoyHome/>}/>
    <Route path = "/del-boy-logIn" element = {<DelBoyLogIn/>}/>
    <Route path = "/all-notification" element={<AllNotification/>}/>
    <Route path = "/receive-order" element={<ReceiveOrderPage/>}/>
        
    </Routes>

     
     
    </div>
  );
}




