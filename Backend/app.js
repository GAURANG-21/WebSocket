import express from "express";
const app = express();
import configServer from "./config/configServer.js";
import { createServer } from "node:http";

const { PORT } = configServer;

// Creating the server instance "app" which internally handles the incoming request and generate the response
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
