const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");
const app = express()
const server = require("http").createServer(app);
const WebSocket = require("ws");

//謎まじない(認証用)
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




//Websocket処理
const wss  = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
  console.log("A new client Connected!");
  ws.send("Welcome New Client!");

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send("Got your msg!! " + data);
  });
});


//ログイン画面に必要なcssの許容
app.use('/css/login.css', express.static(path.join(__dirname, "public/css/login.css")));
app.use('/css/dotsAnimation.css', express.static(path.join(__dirname, "public/css/dotsAnimation.css")));


//未ログインのユーザーは、ログインページ以外アクセスできない。
app.use((req, res, next) => {
  if (req.path === '/login' || req.session.username) { // Changed from '/login.html' to '/login'
    next();
  } else {
    res.redirect('/login'); // Changed from '/login.html' to '/login'
  }
});



//ログイン処理
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'password') {
    req.session.regenerate((err) => {
      if (err) {
        console.log(err);
      }
      req.session.username = 'admin';
      res.redirect('/result'); // Changed from '/index.html' to '/'
      console.log("ログイン済み");
    });
  } else {
    res.redirect('/login');
    console.log("ログイン失敗");
  }
});

//login.htmlへ遷移
app.get('/login', function (req, res) {
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


