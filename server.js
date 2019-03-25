var find = require('array-find')
var camelcase = require('camelcase');
var multer = require('multer');
var upload = multer({dest: 'static/upload/'});
//var mongo = require('mongodb').MongoClient;

var slug = require('slug');
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config();

var mongoose = require('mongoose');
//--------------- mongodb
/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://emma.oudmaijer@hva.nl:emma.oudmaijer1@cluster0-cjez5.mongodb.net/Feliz?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("Feliz").collection("accounts");
  // perform actions on the collection object
  client.close();
});
*/
//const dbName = 'mydatingwebsite';
//const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
//const uri = "mongodb+srv://admin:emma.oudmaijer1!@Feliz-cjez5.mongodb.net/test?retryWrites=true";


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;
const client = new MongoClient(uri, { useNewUrlParser: true });
var collection = null;
client.connect(err => {
       collection = client.db(process.env.DB_NAME).collection("accounts");
});

//const client = new MongoClient(uri, { useNewUrlParser: true });
/*
mongo.MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
        if (err) throw err;
        db = client.db(process.env.DB_NAME);
        //console.log(db);

        db.collection('accounts').find().toArray(function(err, data) {  
                if (err) throw err;
                
                //db.close();
              });
});
*/

/*
client.connect(err => {
    if (err) throw err;
    db = client.db(process.env.DB_NAME);
    //console.log(db);
    db.collection('accounts').find().toArray(function(err, data) {  
        if (err) throw err;
        console.log(data);
        //db.close();
      });
    //var data = [db.collection('accounts').find()];
    /*
    db.collection("accounts").findOne({id:2}, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        //db.close();
      });
    */
    //console.log(data);
    
   //var data = result;
   //console.log(data);
//});


/*
var MongoClient = function(server, options);
MongoClient.prototype.open
MongoClient.prototype.close
MongoClient.prototype.db
MongoClient.connect(mongodb:[emmaoudmaijer:emma.oudmaijer1@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[Feliz][?options]])

MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server('localhost', 27019));
mongoClient.open(function(err, mongoClient) {
  var db1 = mongoClient.db("mydb");

  mongoClient.close();
});
*/ 

//--------------- express

var express = require('express');

var app = express();

var port = 8000;

/*
var data2 = [
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
*/

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
        var param = req.param("id");
        collection.find({'_id':ObjectId(param)}).toArray(function(err, data) {  
            if (err) throw err;
            console.log(data);
            res.render('account.pug', {data:data} ); 
        });
    
}

app.get('/accounts', accounts)
function accounts(req, res) {
        collection.find().toArray(function(err, data) {  
            if (err) throw err;
            res.render('accounts.pug', {data:data}); 
        });
}

app.post('/accounts', form)
function form(req, res) {

        collection.insertOne({
          name: req.body.name,
          email: req.body.email,
          profielfoto: req.body.profielfoto
        })

       res.redirect('/accounts');
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

/*
express()
 //.get('/log-out', logout)

  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))*/
 /*
  function signup(req, res, next) {
      
      function onhash(hash) {
        function oninsert(err) {
            if (err) {
              next(err)
            } else {
              req.session.user = {username: username}
              res.redirect('/')
            }
          }
        }
      }
      
      function login(req, res, next) {

        function done(err, data) {
      
          function onverify(match) {
            if (match) {
              req.session.user = {username: user.username};
              res.redirect('/')
            } else {
              res.status(401).send('Password incorrect')
            }
          }
        }
      }
      
      function form(req, res) {
        if (req.session.user) {
          res.render('add.ejs')
        } else {
          res.status(401).send('Credentials required')
        }
      }
      
      function add(req, res, next) {
        if (!req.session.user) {
          res.status(401).send('Credentials required')
          return
        }
      
      }
      
      function remove(req, res, next) {
      
        if (!req.session.user) {
          res.status(401).send('Credentials required')
          return
        }
      }

      function movies(req, res, next) {
        connection.query('SELECT * FROM movies', done)
      
        function done(err, data) {
          if (err) {
            next(err)
          } else {
            res.render('list.ejs', {
              data: data,
              user: req.session.user
            })
          }
        }
      }
      
      function movie(req, res, next) {
      
        function done(err, data) {
          if (err) {
            next(err)
          } else if (data.length === 0) {
            next()
          } else {
            res.render('detail.ejs', {
              data: data[0],
              user: req.session.user
            })
          }
        }
      }
      
      function logout(req, res, next) {
        req.session.destroy(function (err) {
          if (err) {
            next(err)
          } else {
            res.redirect('/')
          }
        })
      }
      


*/
app.listen(port);