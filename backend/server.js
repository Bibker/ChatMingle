const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/dummyData");
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes= require('./routes/userRoutes');

const app= express();

dotenv.config();
connectDB();

app.use(express.json());

app.get("/", (req,res)=> {
    res.send("API is Running");
})

app.use('/api/user', userRoutes)
 const PORT = process.env.PORT || 5000;
 
app.listen(
    PORT, 
    console.log(`App is running on Port ${PORT}`.yellow.bold)
    );