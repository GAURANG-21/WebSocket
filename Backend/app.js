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
  socket.broadcast.emit("Welcome", `${socket.id} joined the server.`);

  socket.on("Message", (data)=>{
    console.log(data);
  })

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
