const packageJson = require('./package.json');
const express = require('express');
//const render = require('@render/cli');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({ port: 8080 });
const version = packageJson.version;

// store the connection Count
let connectionCount = 0;
// store the WebSocket objects for each client
const clients = {};

wss.on('connection', (ws, req) => {
    // increment the connection count
    connectionCount++;
    // assign a unique identifier to the client
    const clientId = req.headers['sec-websocket-key'];

    // store the client's WebSocket object
    clients[clientId] = ws;

    console.log(`New WebSocket connection: ${clientId}`);

    // log the connection count
    console.log(`Number of connections: ${connectionCount}`)
    console.log(`Client connected remoteaddress: ${req.connection.remoteAddress}`);

  ws.on('message', (message) => {
    
    console.log(`Received message from ${clientId}: ${message}`);
    console.log(`Received message: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    connectionCount--;

    console.log(`WebSocket connection closed: ${clientId}`);
    // remove the client from the clients object
    delete clients[clientId];

    console.log(`Number of connections: ${connectionCount}`);
  });
});

// Home page route
app.get('/', (req, res) => {
  //res.send('Hello World');
  //res.send(`Hello World<br>Server IP: ${os.networkInterfaces().eth0[0].address}`);
  res.sendFile(path.join(__dirname, 'start.html'));
  
});

// Game page route
app.get('/game', (req, res) => {
  console.log('starting game and Searching for second player...');
  
  
  res.sendFile('game\\client.html', { root: __dirname });

});

console.log(process.env);
console.log('version:' + version);
console.log(`Root of server: ${__dirname}`);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('Server IP:');
  console.log('networkInterfaces' + JSON.stringify(os.networkInterfaces()));

});