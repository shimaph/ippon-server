const express = require('express')
const path = require("path");
const app = express()
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss  = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
  console.log("A new client Connected!");
  ws.send("Welcome New Client!");

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send("Got your msg!! " + data);
  });
});



app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")))


// app.get('/', function (req, res) {
//   res.send('')
// })









app.post('/api/v1/quiz', function (req, res) {
  const answer = req.body.answer;
  if(answer === "2"){
    res.redirect("/correct.html");
  }else{
    res.redirect("/wrong.html");
  }

})


app.get('/about', function (req, res) {
    res.send('Aboutページ')
  })

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("I am running!");
})


