import React from 'react';
// import './common.css';
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Userlogin from './pages/Userlogin';
import UserSignUp from './pages/UserSignUp';
import DrLogin from './pages/DrLogin';
import DrsignUp from './pages/DrsignUp';
import { UserProvider } from './context/UserContext';
import UserProtected from './pages/UserProtected';
import UserLogout from './pages/UserLogout';
import DrProtected from './pages/DrProtected';
import DrHome from './pages/DrHome';
import AllappointDr from './pages/AllappointDr';
import UserAppointments from './pages/UserAppointments';
import FindClinic from './pages/FindClinic';
import CreateClinic from './pages/CreateClinic';
import RequestConsultation from './pages/RequestConsultation'
import PendingConsultation from './pages/PendingConsultation';
import DrLogout from './pages/DrLogout';
import DrActiveAppointment from './pages/DrActiveAppointment';
import MedCheck from './pages/MedCheck';
import AllClinics from './pages/AllClinics';
import ClinicDetails from './pages/ClinicDetails';
import ClinicLogin from './pages/ClinicLogin';
import ClinicDashboard from './pages/ClinicDashboard';
import ClinicLogout from './pages/ClinicLogout';
import AddMyClinic from './pages/AddMyClinic';
import PendingDr from './pages/PendingDr';
import MyClinicDr from './pages/MyClinicDr';
import PendingClinicDr from './pages/PendingClinicDr';
import OrderMedicine from './pages/OrderMedicine';
import MyMedicine from './pages/MyMedicine';
import AllMedOrders from './pages/AllMedOrders';

 
 
 

function App() {
  return (
    <div >
      
    <Routes>
    <Route path='/' element = {<UserProtected><Home/></UserProtected> } /> 

    <Route path = '/my-medicine' element={<UserProtected><MyMedicine/></UserProtected>}></Route>
    <Route path='/all-orders/:clinicId' element={<AllMedOrders/>}></Route>

    <Route path = '/med-check' element= {<MedCheck/>} />

    <Route path='/requestconsultation/:doctorId' element = {
         <RequestConsultation/>
      } />

    <Route path='/pending-consultation' element = {
         <PendingConsultation/>
      } />



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
      <Route path='/userlogin' element = {<Userlogin/>} />
      <Route path='/usersignup' element = {<UserSignUp/>}/>
      <Route path='/drlogin' element = {<DrLogin/>} />
      <Route path='/drsignup' element = {<DrsignUp/>}/>
      <Route path='/clinic-logout' element = {<DrProtected><ClinicLogout/></DrProtected> } /> 
      <Route path='/users/logout' element = {<UserProtected><UserLogout/></UserProtected>} /> 
      <Route path='/dr/logout' element = {<DrProtected><DrLogout/></DrProtected>} /> 
      <Route path='/add-my-clinic' element = {<DrProtected><AddMyClinic/></DrProtected>}/>
      <Route path='/my-clinic-dr' element = {<MyClinicDr/>}/>

      <Route path='/my-pending-clinic-dr' element = {<PendingClinicDr/>}/>

      <Route path='/pending-doctors' element = {<PendingDr/>}/>

      <Route path='order-medicine/:clinicId' element = {<OrderMedicine/>} />
        
     </Routes>

     
     
    </div>
  );
}

export default App;




