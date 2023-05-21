// Create WebSocket connection.
const host = location.origin.replace(/^http/, 'ws');
const socket = new WebSocket(host);
// const socket = new WebSocket("ws://localhost:3000");

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to the server");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});

const sendMessage = () => {
    socket.send("Hello");
}
