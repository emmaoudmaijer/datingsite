var camelcase = require('camelcase');

var multer = require('multer');
var upload = multer({dest: 'static/upload/'});

var slug = require('slug');
var bodyParser = require('body-parser');

//--------------- mongodb

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://emma.oudmaijer@hva.nl:emma.oudmaijer1@cluster0-cjez5.mongodb.net/Feliz?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("Feliz").collection("accounts");
  // perform actions on the collection object
  client.close();
});



//--------------- express

var express = require('express');

var app = express();

var port = 8000;

var data = [
     {
        id: 1,
        name: 'Emma Oudmaijer',
        email: 'Emmaoudmaijer@hva.nl',
        profielfoto: '',
     },
     {
        id: 2,
        name: 'Youp Schaefers',
        email: 'youpschaefers@gmail.com',
        profielfoto: '',
     }
]

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'pug');
app.use(express.static('/static'));

//-------------------- website pages -------------------------

app.get('/', homepage)
function homepage(req, res) {
        res.render('index.pug');
}

app.get('/aanmelden', aanmelden)
function aanmelden(req, res) {
        res.render('aanmelden.pug');
}

app.get('/account', account)
function account(req, res) {
    res.render('account.pug', {data:data, 'accountid': req.param("aid")} );
}

app.get('/accounts', accounts)
function accounts(req, res) {
        res.render('accounts.pug', {data:data});
}

app.post('/accounts', form)
function form(req, res) {
        var id = data.length+1
        data.push({
                id: id,
                name: req.body.name,
                email: req.body.email,
                profielfoto: req.body.profielfoto
        })
        res.render('accounts.pug',{data:data})
}

app.get('/aboutme', aboutpage)
function aboutpage(req, res) {
        res.render('about.pug');
}

app.get('/login', login)
function login(req, res) {
        res.render('login.pug');
}

//----------------- display custom 404 error message when page not found ---------------------
app.use(function(req, res, next){
  res.status(404);
// default to plain-text. send()
  res.type('txt').send('404 NOT FOUND...');
});

app.listen(port);
