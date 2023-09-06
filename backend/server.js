const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/dummyData");
const connectDB = require("./config/db");
const colors = require('colors');

const app= express();

dotenv.config();
connectDB();

app.get("/", (req,res)=> {
    res.send("API is Running");
})

app.get("/api/chats",(req,res)=> {
    res.send(chats)
 })

 app.get("/api/chats/:id",(req,res)=> {
    const {id}= req.params;
    const singleChat= chats.find((c)=>c._id===id)
    res.send(singleChat)
 })
  

 const PORT = process.env.PORT || 5000;
 
app.listen(
    PORT, 
    console.log(`App is running on Port ${PORT}`.yellow.bold)
    );