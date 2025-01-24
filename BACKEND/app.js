const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
 
const express = require('express');
 
const cors = require('cors')
const app = express();
const connectDB = require('./DataBase/db');

const userRoutes = require('./routes/user_routes');

connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users",userRoutes);
 



app.get('/',(req,res)=>{
    res.send("HELLO UMAR");
});



module.exports =  app;
