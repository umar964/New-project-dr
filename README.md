# Healify  
Healify is a healthcare management web application that aims to improve the interaction between doctors and patients, streamline clinic operations, and facilitate medicine delivery.  
*(Currently about 30% completed. The backend is in progress, and frontend work is minimal.)*

---

## Current Features (Backend)

### User / Patient
- Signup, login, logout  
- View all doctors  
- Book online appointments for any date  
- Book local 10-minute slots with real-time availability  

### Doctor & Clinic Owner
- Doctor or clinic owner signup and management  
- Admin verification for clinics and doctors  
- Manage appointments and availability  

### Medicine Delivery
- Users can order medicines (e.g., `Seridon 10 tablets`) from a clinic pharmacy  
- Clinic owners can accept or reject orders  
- "Ready for Delivery" status with live notifications using Socket.io  
- Delivery personnel receive real-time notifications  
- OTP confirmation at both clinic pickup and user delivery  
- Payment options: online or cash on delivery  

### Delivery Boy
- Signup, login, logout  
- Receive real-time delivery notifications  
- OTP-based pickup and drop verification  

### Chatbot
- Symptom-based chatbot that suggests rest or a doctor's visit  
- Provides medicine information through text or photos  
- Token blacklist system for security  

---

## Planned Features
- Live location tracking and route navigation using Google Maps  
- Delivery personnel location and clinic tracking  
- "Find clinics near me"  
- "Check doctor availability"  
- AI emergency check that sends live location to the clinic and police if there is no response  
- Drone or ambulance-based first aid system  

---

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Socket.io  
- **Frontend (in progress):** React.js, Tailwind CSS, Vite  
- **Maps & Location:** Google Maps API  
- **Authentication:** JWT  

---

## Setup Instructions

### Backend
```bash
cd backend
npm install
nodemon main.js
```
