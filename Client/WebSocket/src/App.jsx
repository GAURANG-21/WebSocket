import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

function App() {
  //If no URL is given in io, then it will host the io OR assume the io(circuit) onto the same server it is running
  const socket = useMemo(() => io("http://localhost:3000/"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("Message", { message, room });
    setMessage("");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("Welcome", (data) => {
      console.log(data);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("receive-message", (data) => {
      setMessages((messages) => [...messages, data]);
      console.log("Message received and the message is:", data);
    });

    //Before the react refreshes, the cleanup function of useEffect runs first
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="h1" component={"div"} gutterBottom>
        Welcome to the Socket.IO
      </Typography>
      <Typography variant="h2" component={"div"} gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoom}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" color="primary" variant="contained">
          Send
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
        />
        <Button type="submit" color="primary" variant="contained">
          Send
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" color="primary" variant="contained">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
