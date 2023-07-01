const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 9090 });

// Enable CORS support by setting the 'Access-Control-Allow-Origin' header
wss.on('headers', (headers, req) => {
  headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'; // Replace with your React app's URL
});

// Event listener for new WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  // Event listener for receiving messages from the client (React app)
  ws.on('message', (data) => {
    // Handle incoming messages from the client (if needed)
    console.log('Received message:', data);
  });
});
