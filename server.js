var camelcase = require('camelcase');

console.log(camelcase('hello-world'));

var nodemon = require('nodemon');

console.log(nodemon('hello-world'));

//--------------- express

var express = require('express')

var app = express();

var port = 8000;

app.set('view engine', 'pug');
app.use(express.static('/static'));

//-------------------- Route naar homepage -------------------------

app.get('/', homepage)
function homepage(req, res) {
        res.render('index.pug');
}


//-------------------- Route naar aboutme -------------------------
app.get('/aboutme', aboutpage)
function aboutpage(req, res) {
        res.render('about.pug');
}

//---------------------- route naar login --------------------------
app.get('/login', login)
function login(req, res) {
        res.render('login.pug');
}

//----------------------------- error ------------------------------
app.use(function(req, res, next){
  res.status(404);
// default to plain-text. send()
  res.type('txt').send('404 NOT FOUND...');
});

app.listen(port);

//app.set('view engine', 'pug');