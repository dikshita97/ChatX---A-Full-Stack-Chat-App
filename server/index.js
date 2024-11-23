const express = require ("express");
const cors = require ("cors");
const mongoose = require ("mongoose");
const userRoutes = require("./routes/userRoutes")
const msgRoutes = require("./routes/msgRoutes")
const socket = require("socket.io")

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/msg", msgRoutes)

mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port : ${process.env.PORT}`)
})

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credential: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});