const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
const express = require('express');
 
const cors = require('cors')
const app = express();

const connectDB = require('./DataBase/db');
const userRoutes = require('./routes/user_routes');

const drRoutes = require('./routes/dr_routes');
const appointMentRoutes = require('./routes/appointMent_routes');

const clinicRoutes = require('./routes/clinicRoutes');
const consultationRoutes = require('./routes/consultationRoutes');

const medicineRoutes = require('./routes/medicineRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users",userRoutes);
app.use("/dr",drRoutes);
app.use("/appointment",appointMentRoutes);
app.use("/clinic",clinicRoutes);
app.use("/consultation",consultationRoutes);
app.use("/med",medicineRoutes);
app.use("/order",orderRoutes)

 



app.get('/',(req,res)=>{
    res.send("HELLO UMAR");
});



module.exports =  app;


 