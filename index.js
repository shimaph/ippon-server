const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");
const app = express()
const server = require("http").createServer(app);
const WebSocket = require("ws");

//
const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))
app.use(express.urlencoded({ extended: false}));
//

//Websocket処理
const wss  = new WebSocket.Server({ server:server });
let clients = [];

wss.on('connection', function connection(ws) {

  clients.push(ws);

  ws.on('message', function message(data) {

    // Broadcasting to all clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (data == "VOTE") {
          client.send("VOTE");
        } else if (data == "RESET") {
          client.send("RESET");
        } else if (data == "STOP") {
          client.send("STOP");
        }
      }
    });
  });

  ws.on('close', function close() {
    clients = clients.filter(client => client !== ws);
  });
});


//遷移処理
app.post('/login', (req, res) => {
  const toggle = req.body.toggle;
  const password = req.body.password;
  if (toggle === 'on' && password === '1234') { 
    res.redirect('/result'); 
  } else if(password === '1234') {
    res.redirect('/vote'); 
  } else {
    res.redirect('/login');
  }
});

//login.htmlへ遷移
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public/login.html")); // Serve your login.html file when '/login' is accessed
});

//result.htmlへ遷移
app.get('/result', function (req, res) {
  res.sendFile(path.join(__dirname, "public/result.html")); 
});

//vote.htmlへ遷移
app.get('/vote', function (req, res) {
  res.sendFile(path.join(__dirname, "public/vote.html"));
});

//theme.htmlへ遷移
app.get('/theme', function (req, res) {
  res.sendFile(path.join(__dirname, "public/theme.html"));
});




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



  app.use(express.static(path.join(__dirname, "public")))

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("I am running!");
})


