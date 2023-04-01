const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const hostname = "97.102.65.205";

const httpPort = 9999;
const wsPort = 3600;

const options = {
  key: fs.readFileSync("../server/secrets/key.pem"),
  cert: fs.readFileSync("../server/secrets/cert.pem"),
};

const server = http.createServer(options, (req, res) => {
  if (req.url === "/unlock") {
    // Handle unlock request from the mobile app
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Unlock request received from mobile app");
    console.log("Unlock request received from mobile app");
  } else {
    res.writeHead(400);
    res.end("Unknown");
    req.on("data", (data) => {
      console.log(`Received message from unkown: ${data}`);
    });
  }
});

server.listen(httpPort, hostname, () => {
  console.log(`Server running at http://${hostname}:${httpPort}/`);
});

const wsServer = new WebSocket.Server({ port: wsPort });

wsServer.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("message", (message) => {
    console.log(`Received message from lock: ${message}`);
  });

  socket.send("Welcome to the WebSocket server!");
});

console.log(`WebSocket server running at ws://${hostname}:${wsPort}/`);
