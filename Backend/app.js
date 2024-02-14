import express from "express";
const app = express();
import configServer from "./config/configServer.js";
import { Server } from "socket.io";
import { createServer } from "node:http";

const { PORT } = configServer;

// Creating the server instance "app" which internally handles the incoming request and generate the response
const server = createServer(app);

// To create a socket/circuit
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected with id", socket.id);

  socket.emit("Welcome", "Welcome to the Server");
  socket.broadcast.emit("welcome", `${socket.id} joined the server.`);

  socket.on("Message", ({ room, message }) => {
    room = room.split(",");
    console.log(room, message);

    if (room[0] != "") io.to(room).emit("receive-message", message);
    //socket.broadcast.emit is only for server side.
    //To send message to rest of the users, use io.emit(with the eventName)
    else socket.broadcast.emit("receive-message", message);
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
