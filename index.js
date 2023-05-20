const express = require('express')
const path = require("path");
const app = express()

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

app.listen(3000, () => {
    console.log("I am running!");
})


