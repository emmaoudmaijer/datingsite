require('dotenv').config();
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;
const client = new MongoClient(uri, { useNewUrlParser: true });
const ObjectId = require('mongodb').ObjectID;

let collection = null;
client.connect(err => {
       collection = client.db(process.env.DB_NAME).collection("accounts");
});


router
    .get('/register', aanmelden)
    .get('/account', account)
    .get('/accounts', accounts)
    .post('/accounts', form);


function aanmelden(req, res) {
        res.render('aanmelden.pug', {'user': {'username':''} });
}

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

function form(req, res) {
        collection.insertOne({
          name: req.body.name,
          email: req.body.email,
          profielfoto: req.body.profielfoto,
          wachtwoord: req.body.password
        })

        req.session.user = {username: req.body.name};

       res.redirect('/account/accounts');
}

module.exports = router;