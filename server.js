/*

*  SCRIPT VOOR BLOK TECH (server)
*  AUTEUR: EMMA OUDMAIJER
*  LAATSTE AANPASSING: 29 MAART 2019
BRONNEN: 
* https://stackoverflow.com/questions/54815294/pug-able-to-access-a-nested-array-from-a-mongo-database-json
* https://docs.mongodb.com/manual/reference/server-sessions/
* https://stackoverflow.com/questions/16478552/convert-objectid-mongodb-to-string-in-javascript

*/
require('dotenv').config();

const express = require('express');
const loginpages = require('./controllers/loginpages.js');
const accountpages = require('./controllers/accountpages.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const ObjectId = require('mongodb').ObjectID;

const app = express();
const port = 8000;

app
    .use(express.static('static'))
    .set('view engine', 'pug')
    .set('views', __dirname + '/views')
    .use(session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET
    }))
    .use(bodyParser.urlencoded({extended: true}))
    .use('/account', accountpages)
    .use('/login', loginpages)



//-------------------- WEBSITE PAGES -------------------------
app.get('/', homepage)

function homepage(req, res) {
        
        if(req.session.user){
            res.render('index.pug', {'user': req.session.user});
        } else{
            res.render('index.pug', {'user': {'username':''} });
        }
        console.log(req.session.user);
}

app.get('/aboutme', aboutpage)
function aboutpage(req, res) {
        res.render('about.pug');
}


//----------------- display custom 404 error message when page not found ---------------------
app.use(function(req, res, next){
  res.status(404);
// default to plain-text. send()
  res.type('txt').send('404 NOT FOUND...');
});

app.listen(process.env.PORT || port);
