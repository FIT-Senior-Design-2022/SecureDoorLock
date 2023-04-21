const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const hostname = "0.0.0.0";

const httpPort = 3000;
const wsPort = 3001;

var doorlock;
var doorURL;
var isDetected;
var faceImage;

const options = {
  key: fs.readFileSync("../server/secrets/key.pem"),
  cert: fs.readFileSync("../server/secrets/cert.pem"),
};

const server = http.createServer(options, (req, res) => {
  var responseData;
  if (req.url === "/Unlock") {
    // Handle unlock request from the mobile app
    if (doorlock) {
      doorlock.send("Command:Unlock");
      res.writeHead(200, { "Content-Type": "application/json" });
      responseData = {
        doorStatus: "Unlock",
        lockState: "Lock",
      };
    } else {
      res.writeHead(502, { "Content-Type": "application/json" });
      responseData = {
        doorStatus: "Lock",
        lockState: "Unlock",
      };
    }
    res.end(JSON.stringify(responseData));
    console.log("Unlock request received from mobile app");
  } else if (req.url === "/Lock") {
    if (doorlock) {
      doorlock.send("Command:Lock");
      res.writeHead(200, { "Content-Type": "application/json" });
      responseData = {
        doorStatus: "Lock",
        lockState: "Unlock",
      };
    } else {
      res.writeHead(502, { "Content-Type": "application/json" });
      responseData = {
        doorStatus: "Unlock",
        lockState: "Lock",
      };
    }
    res.end(JSON.stringify(responseData));
    console.log("Lock request received from mobile app");
  } else if (req.url === "/VideoFeed") {
    if (doorlock) {
      res.writeHead(200, { "Content-Type": "application/json" });
      responseData = {
        url: doorlock.url,
      };

      console.log("URL Sent");
    } else {
      res.writeHead(502, { "Content-Type": "application/json" });
    }
    res.end(JSON.stringify(responseData));
    console.log("Video request received from mobile app");
  } else if (req.url === "/getVisitor") {
    if (doorlock) {
      doorlock.send("Command:VideoFeed");
      res.writeHead(200, { "Content-Type": "application/json" });
      responseData = {
        isDetected: isDetected,
        faceImage: faceImage, //Base64 encoded will decode on the other end
      };
    } else {
      res.writeHead(502, { "Content-Type": "application/json" });
    }
    res.end(JSON.stringify(responseData));
    console.log("Video request received from mobile app");
  } else {
    res.writeHead(404);
    res.end("Unknown");
    req.on("data", (data) => {
      console.log("Received message unable to convert to Command");
    });
  }
});

server.listen(httpPort, hostname, () => {
  console.log(`Server running at http://${hostname}:${httpPort}/`);
});

const wsServer = new WebSocket.Server({ port: wsPort });

wsServer.on("connection", (socket) => {
  socket.on("message", (data) => {
    content = JSON.parse(data);
    console.log(content);
    if (content.type === "init") {
      doorURL = content.url;
    } else if (content.type === "face_detected") {
      isDetected = true;
      content.image = faceImage;
    }
    doorlock = socket;
  });

  console.log("New WebSocket connection");
});

console.log(`WebSocket server running at ws://${hostname}:${wsPort}/`);
