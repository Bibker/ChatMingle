const express = require("express");
const bodyParser= require('body-parser');
const dotenv = require("dotenv");
const chats = require("./data/dummyData");
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

dotenv.config();
connectDB();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.get("/", (req, res) => {
    res.send("API is Running");
})

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server= app.listen(
    PORT,
    console.log(`App is running on Port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection", (socket)=> {
    console.log("Connected to Socket.io");

    socket.on('setup', (userData)=> {
        socket.join(userData._id);
        socket.emit('connected');

    });

    socket.on('join chat', (room)=> {
        socket.join(room);
        console.log(`User Joined room: ${room}`);
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })
})
