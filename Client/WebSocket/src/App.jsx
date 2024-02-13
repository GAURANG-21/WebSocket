import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {

  //If no URL is given in io, then it will host the io OR assume the io(circuit) onto the same server it is running
  const socket = io('http://localhost:3000/');

  useEffect(()=>{
    socket.on('connect', ()=>{
      console.log("Connected", socket.id);
    })
  }, [])
  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
}

export default App;
