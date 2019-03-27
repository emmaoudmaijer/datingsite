/*
*  SCRIPT VOOR BLOK TECH (server)
*  AUTEUR: EMMA OUDMAIJER
*  LAATSTE AANPASSING: 29 MAART 2019
BRONNEN: 
* https://stackoverflow.com/questions/54815294/pug-able-to-access-a-nested-array-from-a-mongo-database-json
* https://docs.mongodb.com/manual/reference/server-sessions/
* https://stackoverflow.com/questions/16478552/convert-objectid-mongodb-to-string-in-javascript
*/

var find = require('array-find')
var camelcase = require('camelcase');
var multer = require('multer');
var upload = multer({dest:'upload/'});
//var slug = require('slug');
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config();



//---------------- CONNECTION TO DATABASE -----------------
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;
const client = new MongoClient(uri, { useNewUrlParser: true });

//---------------- GET DATABASE COLLECTIONS -----------------
var collection2 = null;
var collection = null;
client.connect(err => {
       collection = client.db(process.env.DB_NAME).collection("accounts");
       collection2 = client.db(process.env.DB_NAME).collection("gebruikers");
});

//--------------- express

var express = require('express');

var app = express();

var port = 8000;

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'pug');
app.use(express.static('static'));
 
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}))

//-------------------- WEBSITE PAGES -------------------------

app.post('/loginverify', loginverify)
function loginverify(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        collection.find({'name':username}).toArray(function(err, data) {  
          if (err) throw err;

          if(data.length>0 && data[0].wachtwoord == password){
              req.session.user = {username: username};
  
              res.redirect('/');
          } else{
               res.redirect('/login');
          }
      });
}


app.get('/', homepage)
function homepage(req, res) {
        
        if(req.session.user){
            res.render('index.pug', {'user': req.session.user});
        } else{
            res.render('index.pug', {'user': {'username':''} });
        }
        console.log(req.session.user);
}

app.get('/aanmelden', aanmelden)
function aanmelden(req, res) {
        res.render('aanmelden.pug', {'user': {'username':''} });
}

app.get('/account', account)
function account(req, res) {

    if(req.session.user){
        var param = req.param("id");
        collection.find({'_id':ObjectId(param)}).toArray(function(err, data) {  
            if (err) throw err;
            res.render('account.pug', {data:data,'user':req.session.user}); 
        });
    } else{
        res.redirect('/login');
    }
}

app.get('/accounts', accounts)
function accounts(req, res) {
    if(req.session.user){
        collection.find().toArray(function(err, data) {  
            if (err) throw err;
            res.render('accounts.pug', {data:data,'user':req.session.user}); 
        });
    } else{
        res.redirect('/login');
    }
}

app.post('/accounts', form)
function form(req, res) {
 
        upload.single(JSON.stringify(req.body.profielfoto));
        collection.insertOne({
          name: req.body.name,
          email: req.body.email,
          profielfoto: req.body.profielfoto,
          wachtwoord: req.body.password
        })

        req.session.user = {username: req.body.name};

       res.redirect('/accounts');
}

app.get('/aboutme', aboutpage)
function aboutpage(req, res) {
        res.render('about.pug');
}

app.get('/login', login)
function login(req, res) {
        if(req.session.user){
            res.render('index.pug', {'user': req.session.user});
        } else{
             res.render('login.pug', {'user': {'username':''} });
        }
        
}

app.get('/logout', logout)
function logout(req, res) {
        req.session.destroy(function (err) {
          if (err) {
            next(err)
          } else {
            res.redirect('/')
          }
        })
}

//----------------- display custom 404 error message when page not found ---------------------
app.use(function(req, res, next){
  res.status(404);
// default to plain-text. send()
  res.type('txt').send('404 NOT FOUND...');
});

app.listen(port);